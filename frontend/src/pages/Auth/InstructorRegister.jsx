import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuthStore from "../../zustand/authStore";
import { Upload, FileText, User, Mail, Clock, LogOut } from "lucide-react";
import LearnHubLogo from "../../components/Common/LearnHubLogo";
import { uploadFile } from "../../api/fileUpload";
import { instructorRegister, checkRequest } from "../../api/auth";
import LogoutConfirmationModal from "../../components/Common/LogoutConfirmationModal";

const InstructorRegister = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [checkingRequest, setCheckingRequest] = useState(true);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [documents, setDocuments] = useState({
    resume: null,
    identityProof: null,
  });

  useEffect(() => {
    const checkPendingRequest = async () => {
      try {
        const response = await checkRequest(user.email);
        if (response.data.success && response.data.request) {
          setPendingRequest(response.data.request);
        }
      } catch (error) {
        console.error("Error checking request:", error);
      } finally {
        setCheckingRequest(false);
      }
    };

    if (user?.email) {
      checkPendingRequest();
    }
  }, [user]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      setDocuments(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documents.resume || !documents.identityProof) {
      toast.error("Please upload both resume and identity proof");
      return;
    }

    setLoading(true);
    try {
      // Upload resume
      const resumeFormData = new FormData();
      resumeFormData.append("file", documents.resume);
      const resumeResponse = await uploadFile(resumeFormData);
      if (!resumeResponse.success) {
        throw new Error("Failed to upload resume");
      }

      // Upload identity proof
      const identityFormData = new FormData();
      identityFormData.append("file", documents.identityProof);
      const identityResponse = await uploadFile(identityFormData);
      if (!identityResponse.success) {
        throw new Error("Failed to upload identity proof");
      }

      // Register instructor with document URLs
      const registerData = {
        name: user.name,
        email: user.email,
        password: user.password,
        resumeUrl: resumeResponse.fileUrl,
        idProofUrl: identityResponse.fileUrl
      };

      const response = await instructorRegister(registerData);
      if (response.data.success) {
        toast.success("Registration successful! Please wait for admin approval.");
        setPendingRequest(response.data.request);
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to complete registration");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  if (!user) {
    return <div>Please login first</div>;
  }

  if (checkingRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF6E9' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#A0C878' }}></div>
      </div>
    );
  }

  if (pendingRequest) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAF6E9' }}>
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-8 flex justify-between items-center">
            <LearnHubLogo />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-[#2E4057] hover:bg-[#DDEB9D] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0C878' }}>
                <Clock className="text-white w-8 h-8" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#2E4057' }}>Registration Pending</h1>
              <p className="text-gray-600 mt-2">Your instructor registration is under review</p>
            </div>

            <div className="bg-[#FAF6E9] p-6 rounded-lg space-y-4">
              <div className="flex items-center space-x-3">
                <User className="text-[#A0C878] w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium" style={{ color: '#2E4057' }}>{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-[#A0C878] w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium" style={{ color: '#2E4057' }}>{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="text-[#A0C878] w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium" style={{ color: '#2E4057' }}>Pending Approval</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-600">
              <p>We will review your application and get back to you soon.</p>
              <p className="mt-2">You will receive an email once your application is approved.</p>
            </div>
          </div>
        </div>
        <LogoutConfirmationModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogoutConfirm}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF6E9' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <LearnHubLogo />
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-[#2E4057] hover:bg-[#DDEB9D] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0C878' }}>
              <FileText className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#2E4057' }}>Instructor Registration</h1>
            <p className="text-gray-600 mt-2">Complete your profile to start teaching</p>
          </div>
          
          {/* User Information Display */}
          <div className="bg-[#FAF6E9] p-6 rounded-lg mb-8">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#2E4057' }}>Your Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="text-[#A0C878] w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium" style={{ color: '#2E4057' }}>{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-[#A0C878] w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium" style={{ color: '#2E4057' }}>{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6" style={{ borderColor: '#DDEB9D' }}>
                <label className="block">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-[#A0C878]" />
                    <p className="mt-2 text-sm font-medium" style={{ color: '#2E4057' }}>
                      Resume (PDF/DOC/DOCX)
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Upload your professional resume
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, "resume")}
                    className="hidden"
                    required
                  />
                </label>
                {documents.resume && (
                  <div className="mt-4 p-3 bg-[#FAF6E9] rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-[#A0C878] w-5 h-5" />
                      <span className="text-sm font-medium truncate max-w-[200px]" style={{ color: '#2E4057' }}>
                        {documents.resume.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDocuments(prev => ({ ...prev, resume: null }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="border-2 border-dashed rounded-lg p-6" style={{ borderColor: '#DDEB9D' }}>
                <label className="block">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-[#A0C878]" />
                    <p className="mt-2 text-sm font-medium" style={{ color: '#2E4057' }}>
                      Identity Proof (PDF/Image)
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Upload your government-issued ID or passport
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, "identityProof")}
                    className="hidden"
                    required
                  />
                </label>
                {documents.identityProof && (
                  <div className="mt-4 p-3 bg-[#FAF6E9] rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-[#A0C878] w-5 h-5" />
                      <span className="text-sm font-medium truncate max-w-[200px]" style={{ color: '#2E4057' }}>
                        {documents.identityProof.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDocuments(prev => ({ ...prev, identityProof: null }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-lg font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: '#A0C878' }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting...
                </span>
              ) : (
                'Submit Documents'
              )}
            </button>
          </form>
        </div>
      </div>
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default InstructorRegister;
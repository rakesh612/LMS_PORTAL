import React, { useState, useEffect } from "react";
import { X, Check, FileText, Award, Download } from "lucide-react";
import toast from "react-hot-toast";
import {
  getPendingRequests,
  verifyInstructor,
  rejectInstructor,
} from "../../api/admin";
const PendingRequestsSection = () => {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState([]);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getPendingRequests();
      setUser(response.users);
      setRequests(response.requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId, e) => {
    e.stopPropagation(); // Prevent the click from triggering the box expansion
    try {
      // TODO: Replace with actual API call
      // await approveRequest(requestId);
      console.log(requestId);
      await verifyInstructor(requestId);
      toast.success("Request approved successfully");
      setRequests(requests.filter((req) => req.id !== requestId));
      fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async (requestId, e) => {
    e.stopPropagation(); // Prevent the click from triggering the box expansion
    try {
      // TODO: Replace with actual API call
      // await rejectRequest(requestId);
      toast.success("Request rejected successfully");
      setRequests(requests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  const toggleExpand = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div
          className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
          style={{ borderColor: "#A0C878" }}
        ></div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl p-4 sm:p-6 shadow-sm"
      style={{ backgroundColor: "#FFFDF6" }}
    >
      <h2
        className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6"
        style={{ color: "#2E4057" }}
      >
        Pending Requests
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {requests.map((request) => (
          <div
            key={request._id}
            className="border rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-[#FFFDF6] transition-colors"
            style={{ borderColor: "#DDEB9D" }}
            onClick={() => toggleExpand(request._id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#A0C878" }}
                >
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3
                    className="text-sm sm:text-base font-medium"
                    style={{ color: "#2E4057" }}
                  >
                    {
                      user.find((user) => user._id === request.instructorId)
                        .name
                    }
                  </h3>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: "#A0C878" }}
                  >
                    {
                      user.find((user) => user._id === request.instructorId)
                        .email
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleApprove(request._id, e)}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-[#DDEB9D] cursor-pointer transition-colors"
                  title="Approve"
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </button>
                <button
                  onClick={(e) => handleReject(request._id, e)}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 cursor-pointer transition-colors"
                  title="Reject"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </button>
              </div>
            </div>
            {expandedRequest === request._id && (
              <div
                className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t"
                style={{ borderColor: "#DDEB9D" }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: "#2E4057" }}
                    >
                      Subject
                    </p>
                    <p
                      className="mt-1 text-sm sm:text-base"
                      style={{ color: "#2E4057" }}
                    >
                      {request.subject}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: "#2E4057" }}
                    >
                      Qualification
                    </p>
                    <p
                      className="mt-1 text-sm sm:text-base"
                      style={{ color: "#2E4057" }}
                    >
                      {request.qualification}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: "#2E4057" }}
                    >
                      Experience
                    </p>
                    <p
                      className="mt-1 text-sm sm:text-base"
                      style={{ color: "#2E4057" }}
                    >
                      {request.experience}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: "#2E4057" }}
                    >
                      Applied Date
                    </p>
                    <p
                      className="mt-1 text-sm sm:text-base"
                      style={{ color: "#2E4057" }}
                    >
                      {request.appliedDate}
                    </p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <p
                    className="text-xs sm:text-sm font-medium mb-2"
                    style={{ color: "#2E4057" }}
                  >
                    Documents
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div
                      className="flex flex-col p-3 sm:p-4 rounded-lg"
                      style={{ backgroundColor: "#DDEB9D" }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: "#2E4057" }}
                        />
                        <span
                          className="text-sm sm:text-base font-medium"
                          style={{ color: "#2E4057" }}
                        >
                          Resume
                        </span>
                      </div>
                      <p
                        className="text-xs sm:text-sm mb-3 truncate"
                        style={{ color: "#2E4057" }}
                      >
                        {request.resumeUrl.split("/").pop()}
                      </p>
                      <a
                        href={request.resumeUrl}
                        download
                        className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-white text-sm sm:text-base font-medium transition-all hover:scale-105 active:scale-95"
                        style={{ backgroundColor: "#A0C878" }}
                      >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Download</span>
                      </a>
                    </div>
                    <div
                      className="flex flex-col p-3 sm:p-4 rounded-lg"
                      style={{ backgroundColor: "#DDEB9D" }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: "#2E4057" }}
                        />
                        <span
                          className="text-sm sm:text-base font-medium"
                          style={{ color: "#2E4057" }}
                        >
                          ID Proof
                        </span>
                      </div>
                      <p
                        className="text-xs sm:text-sm mb-3 truncate"
                        style={{ color: "#2E4057" }}
                      >
                        {request.idProofUrl.split("/").pop()}
                      </p>
                      <a
                        href={request.idProofUrl}
                        download
                        className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-white text-sm sm:text-base font-medium transition-all hover:scale-105 active:scale-95"
                        style={{ backgroundColor: "#A0C878" }}
                      >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequestsSection;

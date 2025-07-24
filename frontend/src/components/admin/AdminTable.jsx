import React, { useState, useEffect } from 'react';
import { User, BookOpen, MoreVertical } from 'lucide-react';

const AdminTable = ({ type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await getRecentData(type);
      // setData(response.data);
      
      // Temporary mock data
      if (type === 'users') {
        setData([
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', joined: '2024-03-15' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Instructor', joined: '2024-03-14' },
          { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Student', joined: '2024-03-13' },
        ]);
      } else {
        setData([
          { id: 1, title: 'React Fundamentals', instructor: 'Jane Smith', students: 150, created: '2024-03-15' },
          { id: 2, title: 'Advanced JavaScript', instructor: 'John Doe', students: 120, created: '2024-03-14' },
          { id: 3, title: 'Node.js Mastery', instructor: 'Mike Johnson', students: 90, created: '2024-03-13' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: '#A0C878' }}></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b" style={{ borderColor: '#DDEB9D' }}>
            {type === 'users' ? (
              <>
                <th className="pb-3 font-medium" style={{ color: '#2E4057' }}>User</th>
                <th className="pb-3 font-medium" style={{ color: '#2E4057' }}>Role</th>
                <th className="pb-3 font-medium" style={{ color: '#2E4057' }}>Joined</th>
              </>
            ) : (
              <>
                <th className="pb-3 font-medium" style={{ color: '#2E4057' }}>Course</th>
                <th className="pb-3 font-medium" style={{ color: '#2E4057' }}>Instructor</th>
                <th className="pb-3 font-medium" style={{ color: '#2E4057' }}>Students</th>
              </>
            )}
            <th className="pb-3 font-medium" style={{ color: '#2E4057' }}></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b" style={{ borderColor: '#DDEB9D' }}>
              {type === 'users' ? (
                <>
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0C878' }}>
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#2E4057' }}>{item.name}</p>
                        <p className="text-sm" style={{ color: '#A0C878' }}>{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#DDEB9D', color: '#2E4057' }}>
                      {item.role}
                    </span>
                  </td>
                  <td className="py-3" style={{ color: '#2E4057' }}>{item.joined}</td>
                </>
              ) : (
                <>
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0C878' }}>
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-medium" style={{ color: '#2E4057' }}>{item.title}</p>
                    </div>
                  </td>
                  <td className="py-3" style={{ color: '#2E4057' }}>{item.instructor}</td>
                  <td className="py-3" style={{ color: '#2E4057' }}>{item.students}</td>
                </>
              )}
              <td className="py-3">
                <button className="p-1 rounded-lg hover:bg-[#DDEB9D] transition-colors">
                  <MoreVertical className="w-5 h-5" style={{ color: '#2E4057' }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable; 
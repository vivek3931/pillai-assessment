import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Users, BookOpen, Activity, PieChart as PieChartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#14b8a6', '#6366f1', '#ec4899'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analytics`);
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="max-w-7xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="w-32 h-4 bg-surface-soft rounded mb-4"></div>
        <div className="w-64 h-10 bg-surface-soft rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-flat p-6 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-surface-soft mb-4"></div>
          <div className="w-16 h-12 bg-surface-soft rounded mb-2"></div>
          <div className="w-24 h-4 bg-surface-soft rounded"></div>
        </div>
        <div className="card-flat p-6 col-span-1 md:col-span-2">
           <div className="w-48 h-6 bg-surface-soft rounded mb-6"></div>
           <div className="h-40 w-full bg-surface-soft rounded"></div>
        </div>
      </div>
      <div className="card-flat mb-8 p-6">
         <div className="w-64 h-6 bg-surface-soft rounded mb-6"></div>
         <div className="h-64 w-64 bg-surface-soft rounded-full mx-auto"></div>
      </div>
      <div className="card-flat p-6">
         <div className="w-40 h-6 bg-surface-soft rounded mb-6"></div>
         <div className="space-y-4">
           {[1,2,3,4].map(i => (
             <div key={i} className="w-full h-12 bg-surface-soft rounded"></div>
           ))}
         </div>
      </div>
    </div>
  );
  if (!data) return <div className="text-center py-12 text-body">Failed to load analytics data.</div>;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-body-sm text-body hover:text-ink no-underline mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to directory
        </Link>
        <h1 className="text-display-lg">Analytics Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-flat p-6 flex flex-col items-center justify-center text-center">
          <Users className="w-8 h-8 text-mute mb-2" />
          <h3 className="text-display-lg">{data.totalStudents}</h3>
          <p className="text-body-sm text-body uppercase tracking-wider mt-1">Total Students</p>
        </div>
        <div className="card-flat p-6 col-span-1 md:col-span-2 min-w-0">
           <div className="flex items-center gap-2 mb-4">
             <BookOpen className="w-5 h-5 text-mute" />
             <h3 className="text-heading-sm">Students by Course (Bar Chart)</h3>
           </div>
           <div className="h-64 w-full">
             {data.studentsByCourseStacked?.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.studentsByCourseStacked} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
                   <XAxis 
                     dataKey="course" 
                     tick={{ fontSize: 10 }} 
                     interval={0} 
                     angle={-45} 
                     textAnchor="end" 
                     tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val} 
                   />
                   <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                   <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb'}} />
                   <Legend verticalAlign="top" height={36}/>
                   <Bar dataKey="Year 1" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
                   <Bar dataKey="Year 2" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                   <Bar dataKey="Year 3" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                   <Bar dataKey="Year 4" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} />
                   <Bar dataKey="Year 5" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             ) : (
               <p className="text-body-sm text-mute flex items-center justify-center h-full">No courses active.</p>
             )}
           </div>
        </div>
      </div>

      <div className="card-flat mb-8 p-6 min-w-0">
         <div className="flex items-center gap-2 mb-4">
           <PieChartIcon className="w-5 h-5 text-mute" />
           <h3 className="text-heading-sm">Course Distribution (Pie Chart)</h3>
         </div>
         <div className="h-64 w-full">
           {data.studentsByCourse.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={data.studentsByCourse}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={90}
                   paddingAngle={5}
                   dataKey="count"
                   nameKey="course"
                 >
                   {data.studentsByCourse.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb'}} />
               </PieChart>
             </ResponsiveContainer>
           ) : (
             <p className="text-body-sm text-mute flex items-center justify-center h-full">No courses active.</p>
           )}
         </div>
      </div>

      <div className="card-flat">
        <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4">
          <Activity className="w-5 h-5 text-mute" />
          <h2 className="text-heading-sm">Recent Activity</h2>
        </div>
        
        {data.recentActivity.length === 0 ? (
          <p className="text-body-sm text-mute text-center py-4">No recent activity found.</p>
        ) : (
          <div className="space-y-4">
            {data.recentActivity.map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg hover:bg-surface-soft transition-colors">
                <div className="flex items-center gap-3 mb-2 sm:mb-0 min-w-0">
                  <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-sm font-mono border ${
                    log.action.includes('ADD') ? 'bg-green-50 text-green-700 border-green-200' : 
                    log.action.includes('UPDATE') ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {log.action}
                  </span>
                  <span className="text-body-sm text-ink font-medium truncate">
                    {log.student_name ? log.student_name : 'Unknown Student'}
                  </span>
                  {log.admission_number && (
                    <span className="text-xs text-mute font-mono flex-shrink-0">({log.admission_number})</span>
                  )}
                </div>
                <div className="text-xs text-mute sm:text-right">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Edit2, Trash2, ChevronRight, LayoutList, TableProperties, BookOpen, GraduationCap } from 'lucide-react';
import Modal from './Modal';
import StudentDetailModal from './StudentDetailModal';
import { PILLAI_COURSES } from '../utils/courses';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filterCourse, setFilterCourse] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [viewMode, setViewMode] = useState('table');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students?page=${page}&limit=10&search=${search}&filterCourse=${filterCourse}&filterYear=${filterYear}`);
      setStudents(res.data.students);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, filterCourse, filterYear]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students/${deleteId}`);
      setDeleteId(null);
      fetchStudents();
    } catch (err) {
      console.error('Failed to delete student', err);
      setDeleteId(null);
    }
  };

  return (
    <div>
      <Modal
        isOpen={!!deleteId}
        type="confirm"
        title="Drop Student"
        message="Are you sure you want to drop this student from the directory? This action cannot be undone."
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
      <StudentDetailModal
        isOpen={!!selectedStudent}
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
      <div className="text-center mb-12">
        <h1 className="text-display-xl mb-6">Student Directory</h1>

        {/* Search and Filters */}
        <div className="w-full flex flex-col md:flex-row items-center gap-4 relative">
          <div className="relative flex-grow w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-mute" />
            </div>
            <input
              type="text"
              className="input-pill pl-11 bg-surface-soft w-full text-left placeholder-mute focus:bg-canvas"
              placeholder="Search students..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <BookOpen className="h-4 w-4 text-mute" />
              </div>
              <select
                className="input-pill bg-surface-soft w-full appearance-none text-body pl-9 pr-4 text-sm"
                value={filterCourse}
                onChange={(e) => { setFilterCourse(e.target.value); setPage(1); }}
              >
                <option value="">All Courses</option>
                {PILLAI_COURSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full md:w-32">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <GraduationCap className="h-4 w-4 text-mute" />
              </div>
              <select
                className="input-pill bg-surface-soft w-full appearance-none text-body pl-9 pr-4 text-sm"
                value={filterYear}
                onChange={(e) => { setFilterYear(e.target.value); setPage(1); }}
              >
                <option value="">All Years</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
                <option value="5">Year 5</option>
              </select>
            </div>

            <div className="hidden sm:flex items-center bg-surface-soft rounded-full p-1 border border-hairline flex-shrink-0">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-canvas shadow-sm text-ink' : 'text-mute hover:text-body'}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-full transition-colors ${viewMode === 'table' ? 'bg-canvas shadow-sm text-ink' : 'text-mute hover:text-body'}`}
              >
                <TableProperties className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-flat flex flex-col sm:flex-row items-center gap-6 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-surface-soft border border-hairline flex-shrink-0"></div>
              <div className="flex-grow w-full space-y-3">
                <div className="h-5 bg-surface-soft rounded w-32 mx-auto sm:mx-0"></div>
                <div className="h-3 bg-surface-soft rounded w-48 mx-auto sm:mx-0"></div>
                <div className="h-3 bg-surface-soft rounded w-40 mx-auto sm:mx-0"></div>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <div className="w-10 h-8 bg-surface-soft rounded-full border border-hairline"></div>
                <div className="w-10 h-8 bg-surface-soft rounded-full border border-hairline"></div>
              </div>
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center text-body py-12">No students found.</div>
      ) : (
        <>
          {/* Mobile View (always compact list) */}
          <div className="space-y-2 sm:hidden">
            {students.map((student) => (
              <div
                key={student.id}
                className="card-flat flex items-center gap-4 p-4 cursor-pointer hover:bg-surface-soft transition-colors"
                onClick={() => setSelectedStudent(student)}
              >
                <div className="w-12 h-12 rounded-full bg-surface-soft overflow-hidden flex-shrink-0 border border-hairline">
                  {student.photo_url ? (
                    <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${student.photo_url}`} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-mute text-[10px]">No img</div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-body-md-strong text-ink truncate">{student.name}</h3>
                  <p className="text-body-sm text-body truncate">{student.course}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-mute" />
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block">
            {viewMode === 'table' ? (
              <div className="card-flat overflow-x-auto p-0">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-hairline bg-surface-soft text-body-sm-strong text-mute">
                      <th className="px-6 py-4 font-medium">Student</th>
                      <th className="px-6 py-4 font-medium">ADM No</th>
                      <th className="px-6 py-4 font-medium">Course</th>
                      <th className="px-6 py-4 font-medium">Year</th>
                      <th className="px-6 py-4 font-medium">Contact</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {students.map(student => (
                      <tr key={student.id} className="hover:bg-surface-soft/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedStudent(student)}>
                            <div className="w-8 h-8 rounded-full bg-surface-soft overflow-hidden flex-shrink-0 border border-hairline">
                              {student.photo_url ? (
                                <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${student.photo_url}`} alt={student.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-mute text-[8px]">No img</div>
                              )}
                            </div>
                            <span className="text-body-md-strong text-ink hover:underline">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono bg-surface-soft px-2 py-0.5 rounded-sm text-ink text-xs border border-hairline">
                            {student.admission_number}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-body-sm text-body">{student.course}</td>
                        <td className="px-6 py-4 text-body-sm text-body">Year {student.year}</td>
                        <td className="px-6 py-4 text-body-sm text-body">
                          <div>{student.email}</div>
                          <div className="text-mute text-xs">{student.mobile_number}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/edit/${student.id}`} className="btn-secondary px-2 h-7">
                              <Edit2 className="w-3.5 h-3.5" />
                            </Link>
                            <button onClick={() => handleDeleteClick(student.id)} className="btn-secondary px-2 h-7 text-red-600 hover:text-red-700 hover:bg-red-50 border-transparent hover:border-red-200">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={`desktop-${student.id}`} className="card-flat flex flex-col sm:flex-row items-center gap-6">
                    {/* Photo */}
                    <div className="w-16 h-16 rounded-full bg-surface-soft overflow-hidden flex-shrink-0 border border-hairline cursor-pointer" onClick={() => setSelectedStudent(student)}>
                      {student.photo_url ? (
                        <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${student.photo_url}`} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-mute text-xs">No img</div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-heading-md mb-1 cursor-pointer hover:underline" onClick={() => setSelectedStudent(student)}>{student.name}</h3>
                      <div className="text-body-sm text-body space-y-1">
                        <p>
                          <span className="font-mono bg-surface-soft px-2 py-0.5 rounded-sm text-ink text-xs mr-2 border border-hairline">
                            {student.admission_number}
                          </span>
                          {student.course} — Year {student.year}
                        </p>
                        <p>{student.email} • {student.mobile_number}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link to={`/edit/${student.id}`} className="btn-secondary px-3 h-8">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDeleteClick(student.id)} className="btn-secondary px-3 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-transparent hover:border-red-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            className="btn-secondary h-8 px-4 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span className="text-body-sm text-body">Page {page} of {totalPages}</span>
          <button
            className="btn-secondary h-8 px-4 disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentList;

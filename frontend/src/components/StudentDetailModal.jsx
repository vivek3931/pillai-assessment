import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, X } from 'lucide-react';

const StudentDetailModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center bg-black/40 sm:px-4 animate-in fade-in duration-200">
      {/* Mobile: slide up from bottom, Desktop: centered modal */}
      <div className="bg-canvas w-full sm:max-w-md sm:rounded-lg shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[80vh] animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in duration-300 rounded-t-2xl">
        
        {/* Header/Sticky Top */}
        <div className="flex justify-between items-center p-4 border-b border-hairline sticky top-0 bg-canvas rounded-t-2xl sm:rounded-t-lg z-10">
          <h3 className="text-heading-md">Student Details</h3>
          <button onClick={onClose} className="p-2 -mr-2 text-mute hover:text-ink transition-colors rounded-full hover:bg-surface-soft">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-grow">
          {/* Profile Header */}
          <div className="flex items-center gap-4 border-b border-hairline pb-6">
             <div className="w-20 h-20 rounded-full bg-surface-soft overflow-hidden flex-shrink-0 border border-hairline">
               {student.photo_url ? (
                 <img src={`http://localhost:5000${student.photo_url}`} alt={student.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-mute text-xs">No img</div>
               )}
             </div>
             <div>
               <h2 className="text-heading-lg mb-1">{student.name}</h2>
               <div className="font-mono bg-surface-soft px-2 py-0.5 rounded-sm text-ink text-xs inline-block border border-hairline mt-1">
                 {student.admission_number}
               </div>
             </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h4 className="text-body-sm-strong text-mute uppercase tracking-wider mb-2">Academic</h4>
              <p className="text-body-md text-ink">{student.course}</p>
              <p className="text-body-sm text-body">Year {student.year}</p>
            </div>
            
            <div>
              <h4 className="text-body-sm-strong text-mute uppercase tracking-wider mb-2">Contact</h4>
              <p className="text-body-md text-ink">{student.email}</p>
              <p className="text-body-md text-ink">{student.mobile_number}</p>
            </div>

            <div>
              <h4 className="text-body-sm-strong text-mute uppercase tracking-wider mb-2">Personal</h4>
              <p className="text-body-sm text-body">Gender: {student.gender}</p>
              <p className="text-body-sm text-body">DOB: {new Date(student.dob).toLocaleDateString()}</p>
              <p className="text-body-sm text-body mt-1">{student.address || 'No address provided'}</p>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-hairline bg-canvas sm:rounded-b-lg">
           <Link to={`/edit/${student.id}`} className="btn-primary w-full justify-center">
             <Edit2 className="w-4 h-4 mr-2" />
             Edit Profile
           </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;

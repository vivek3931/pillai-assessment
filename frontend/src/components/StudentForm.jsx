import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm as useReactHookForm } from 'react-hook-form';
import axios from 'axios';
import { ArrowLeft, User, Calendar, Mail, Phone, Users, MapPin, BookOpen, GraduationCap } from 'lucide-react';
import Modal from './Modal';
import { PILLAI_COURSES } from '../utils/courses';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  // Restrict to students 18 or older
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0];

  const { register, handleSubmit, setValue, formState: { errors } } = useReactHookForm({
    defaultValues: {
      name: '',
      course: '',
      year: 1,
      dob: '',
      email: '',
      mobile_number: '',
      gender: 'Other',
      address: ''
    }
  });

  useEffect(() => {
    if (isEdit) {
      axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students/${id}`)
        .then(res => {
          const s = res.data;
          setValue('name', s.name);
          setValue('course', s.course);
          setValue('year', s.year);
          // format date for input
          const formattedDob = new Date(s.dob).toISOString().split('T')[0];
          setValue('dob', formattedDob);
          setValue('email', s.email);
          setValue('mobile_number', s.mobile_number);
          setValue('gender', s.gender);
          setValue('address', s.address);
          if (s.photo_url) {
            setPhotoPreview(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${s.photo_url}`);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, isEdit, setValue]);

  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      
      const fileInput = document.querySelector('#photo');
      if (fileInput && fileInput.files[0]) {
        formData.append('photo', fileInput.files[0]);
      }

      if (isEdit) {
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      setModalTitle('Error Saving Student');
      setModalMessage(err.response?.data?.error || 'Failed to save student. Ensure email and admission number are unique.');
      setModalOpen(true);
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="w-32 h-4 bg-surface-soft rounded mb-4"></div>
        <div className="w-48 h-8 bg-surface-soft rounded"></div>
      </div>
      <div className="space-y-8">
        <div className="card-flat">
          <div className="w-40 h-6 bg-surface-soft rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="col-span-1 sm:col-span-2 flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full bg-surface-soft mb-3 border border-hairline"></div>
              <div className="w-28 h-8 rounded-full bg-surface-soft border border-hairline"></div>
            </div>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={i === 6 ? "col-span-1 sm:col-span-2" : ""}>
                <div className="w-24 h-4 bg-surface-soft rounded mb-2"></div>
                <div className="h-10 bg-surface-soft rounded-full border border-hairline w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Modal 
        isOpen={modalOpen} 
        title={modalTitle} 
        message={modalMessage} 
        onClose={() => setModalOpen(false)} 
      />
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-body-sm text-body hover:text-ink no-underline mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to directory
        </Link>
        <h1 className="text-display-lg">{isEdit ? 'Edit Student' : 'Add Student'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-24 sm:pb-0">
        <div className="card-flat">
          <h2 className="text-heading-sm mb-6 border-b border-hairline pb-4">Personal Information</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="col-span-1 sm:col-span-2 flex flex-col items-center mb-4">
               <div className="w-24 h-24 rounded-full bg-surface-soft overflow-hidden mb-3 border border-hairline relative group">
                 {photoPreview ? (
                   <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-mute text-sm">Photo</div>
                 )}
               </div>
               <div>
                 <input type="file" id="photo" accept="image/*" onChange={onPhotoChange} className="hidden" />
                 <label htmlFor="photo" className="btn-secondary px-4 h-8 text-xs cursor-pointer">
                   Upload Photo
                 </label>
               </div>
            </div>

            <div>
              <label className="block text-body-sm-strong mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-mute" />
                </div>
                <input {...register('name', { required: true })} className="input-pill pl-10 w-full" placeholder="Jane Doe" />
              </div>
              {errors.name && <span className="text-red-500 text-xs mt-1">Required</span>}
            </div>
            
            <div>
              <label className="block text-body-sm-strong mb-1">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-mute" />
                </div>
                <input 
                  type="date" 
                  max={maxDate}
                  {...register('dob', { 
                    required: "Required",
                    max: { value: maxDate, message: "Must be 18 or older" }
                  })} 
                  className="input-pill pl-10 pr-4 w-full" 
                />
              </div>
              {errors.dob && <span className="text-red-500 text-xs mt-1">{errors.dob.message || "Required"}</span>}
            </div>

            <div>
              <label className="block text-body-sm-strong mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-mute" />
                </div>
                <input type="email" {...register('email', { required: true })} className="input-pill pl-10 w-full" placeholder="jane@example.com" />
              </div>
              {errors.email && <span className="text-red-500 text-xs mt-1">Required</span>}
            </div>

            <div>
              <label className="block text-body-sm-strong mb-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-mute" />
                </div>
                <input {...register('mobile_number', { required: true })} className="input-pill pl-10 w-full" placeholder="+91 9876543210" />
              </div>
              {errors.mobile_number && <span className="text-red-500 text-xs mt-1">Required</span>}
            </div>

            <div>
              <label className="block text-body-sm-strong mb-1">Gender</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Users className="h-4 w-4 text-mute" />
                </div>
                <select {...register('gender')} className="input-pill pl-10 pr-4 w-full appearance-none relative z-0 bg-transparent">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-body-sm-strong mb-1">Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-mute" />
                </div>
                <input {...register('address')} className="input-pill pl-10 w-full" placeholder="123 Main St, City" />
              </div>
            </div>
          </div>
        </div>

        <div className="card-flat">
          <h2 className="text-heading-sm mb-6 border-b border-hairline pb-4">Academic Details</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-body-sm-strong mb-1">Course</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <BookOpen className="h-4 w-4 text-mute" />
                </div>
                <select {...register('course', { required: true })} className="input-pill pl-10 pr-4 w-full appearance-none relative z-0 bg-transparent">
                  <option value="">Select Course</option>
                  {PILLAI_COURSES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {errors.course && <span className="text-red-500 text-xs mt-1">Required</span>}
            </div>

            <div>
              <label className="block text-body-sm-strong mb-1">Year</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <GraduationCap className="h-4 w-4 text-mute" />
                </div>
                <select {...register('year', { required: true, valueAsNumber: true })} className="input-pill pl-10 pr-4 w-full appearance-none relative z-0 bg-transparent">
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                  <option value="5">Year 5</option>
                </select>
              </div>
              {errors.year && <span className="text-red-500 text-xs mt-1">Required</span>}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-canvas p-3 border-t border-hairline flex gap-4 sm:static sm:bg-transparent sm:p-0 sm:mt-8 sm:pt-8 sm:border-t z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:shadow-none sm:justify-end">
          <Link to="/" className="btn-secondary flex-1 sm:flex-none">
            Cancel
          </Link>
          <button type="submit" className="btn-primary flex-1 sm:flex-none">
            {isEdit ? 'Update Student' : 'Save Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;

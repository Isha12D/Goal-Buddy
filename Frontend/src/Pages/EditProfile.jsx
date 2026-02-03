import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { FiCamera, FiTrash2} from 'react-icons/fi';

const EditProfile = ({ userFromState, onClose }) => {
    const { currentUser, logout } = useAuth();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = async () => {
        if (!confirmDelete) {
        setConfirmDelete(true); // show confirm button
        return;
        }

        try {
        const res = await axios.delete(
            `http://localhost:3006/user/delete/${currentUser._id}`,
            {
            headers: {
                Authorization: `Bearer ${currentUser.accessToken}`,
            },
            }
        );

        if (res.status === 200) {
            alert("Account deleted successfully");
            logout(); // clear local state/context + tokens
            onClose();
        }
        } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Delete failed");
        }
    };

    useEffect(() => {
        if (userFromState) {
            setFormData({ name: userFromState.name, email: userFromState.email, password: "" });
        }
    }, [userFromState]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProfilePicFile(e.target.files[0]);
    }

    const handleSave = async () => {
        try {
            console.log("Access Token:", currentUser.accessToken);
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('password', formData.password);
            if(profilePicFile) data.append('profilePic', profilePicFile);
            const res = await axios.put('http://localhost:3006/user/update', data, {
                headers: {
                    Authorization: `Bearer ${currentUser.accessToken}`,
                    'Content-Type': 'multipart/form-data', ///-> changed due to multer and cloudinary thing
                },
            });

            if (res.status === 200) alert('Profile updated successfully!!');
            onClose();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Update failed </3');
        }
    };

    return (
        <div>
            <h2 className="text-xl mb-4">Edit Profile</h2>

            {/* Profile picture with hover camera icon */}
            <div className="flex justify-center mb-4">
                <div className="relative group">
                    <img
                        src={profilePicFile ? URL.createObjectURL(profilePicFile) : userFromState?.profilePic}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-lg object-cover"
                    />
                    <button
                        type="button"
                        onClick={() => document.getElementById('profilePicInput').click()}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <FiCamera className="text-white w-6 h-6" />
                    </button>
                    <input
                        type="file"
                        id="profilePicInput"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            </div>


            <input
                type="text"
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Name'
                className="w-full border border-gray-500 rounded p-2 mb-3"
            />
            <input
                type="email"
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Email'
                className="w-full border border-gray-500 rounded p-2 mb-3"
            />
            <input
                type="password"
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='New Password'
                className="w-full border border-gray-500 rounded p-2 mb-3"
            />

            <div className="flex justify-between">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-600 rounded"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className='px-4 py-2 bg-orange-500 text-white rounded'
                >
                    Save
                </button>
            </div>

            {/* Delete account section */}
            <div className="mt-6 text-center border-t pt-4">
                <button
                onClick={handleDelete}
                className="flex items-center justify-center mx-auto px-4 py-2 bg-red-600 text-white rounded"
                >
                <FiTrash2 className="mr-2" />
                {confirmDelete ? "Confirm Delete" : "Delete Account"}
                </button>
                {confirmDelete && (
                <p className="text-sm text-red-500 mt-2">
                    Click again to permanently delete your account
                </p>
                )}
            </div>
        </div>
    );
};

export default EditProfile;

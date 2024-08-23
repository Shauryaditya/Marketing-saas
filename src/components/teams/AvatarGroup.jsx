import React from "react";

const AvatarGroup = () => {
  const avatars = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/1.jpg",
    "https://randomuser.me/api/portraits/men/2.jpg",
    "https://randomuser.me/api/portraits/women/2.jpg",
  ];

  return (
    <div className="flex items-center -space-x-2">
      {avatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index + 1}`}
          className="w-6 h-6 rounded-full border-2 border-white -ml-3 first:ml-0"
        />
      ))}
    </div>
  );
};

export default AvatarGroup;

import { IUser } from "@/Interfaces/IUserLoginInterfaces";

export const getUserDisplayName = (user:IUser): string => {
  console.log('User object:', user);

  if (!user) return 'User';

  const {
    firstname,
    lastname,
    firstName,
    lastName,
    username,
    email,
  } = user;

  // Check API response format first
  if (firstname && lastname) {
    return `${firstname} ${lastname}`;
  }

  // Check local storage format
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  // Safely check email and prevent split errors
  if (email) {
    return email.split('@')[0];
  }

  // Fallback to username or default
  return username || 'User';
};

export const getInitials = (user: IUser): string => {
  if (!user || typeof user !== 'object') return '?';

  const { firstname, lastname, username, email } = user;

  // Ensure firstname & lastname exist before calling `.charAt()`
  if (firstname?.charAt(0) && lastname?.charAt(0)) {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  }

  // Use username initials if available
  if (username?.substring(0, 2)) {
    return username.substring(0, 2).toUpperCase();
  }

  // Ensure email exists before calling `.charAt()`
  return email?.charAt(0)?.toUpperCase() || '?';
};

  export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
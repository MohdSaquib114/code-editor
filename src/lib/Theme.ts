export interface Theme {
    editorBg: string;
    editorText: string; 
    sidebarBg: string;
    navbarBg: string;
    navbarBtn1Bg: string;
    navbarBtn2Bg: string;
    navbarDropdownBg: string;
    navbarText: string;
    sidebarText: string;
    sidebarHover: string;
    sidebarBtnSelected: string;
    borderColor: string; 
    navbarHover: string; 
  }
  
  export const themes: Record<string, Theme> = {
    default: {
      editorBg: 'bg-gray-100',
      editorText: 'text-gray-900',
      sidebarBg: 'bg-white',
      navbarBg: 'bg-blue-500',
      navbarBtn1Bg: 'bg-blue-600',
      navbarBtn2Bg: 'bg-blue-700',
      navbarDropdownBg: 'bg-blue-300',
      navbarText: 'text-white',
      sidebarText: 'text-gray-900',
      sidebarHover: 'hover:bg-gray-200',
      sidebarBtnSelected: 'bg-blue-400',
      borderColor: 'border-gray-300', 
      navbarHover: 'hover:bg-blue-400', 
    },
    dark: {
      editorBg: 'bg-gray-900',
      editorText: 'text-gray-100', 
      sidebarBg: 'bg-gray-800',
      navbarBg: 'bg-black',
      navbarBtn1Bg: 'bg-gray-700',
      navbarBtn2Bg: 'bg-gray-600',
      navbarDropdownBg: 'bg-gray-700',
      navbarText: 'text-gray-100',
      sidebarText: 'text-gray-300',
      sidebarHover: 'hover:bg-gray-700',
      sidebarBtnSelected: 'bg-gray-600',
      borderColor: 'border-gray-600', 
      navbarHover: 'hover:bg-gray-700', 
    },
    twilight: { 
      editorBg: 'bg-purple-900',
      editorText: 'text-purple-200', 
      sidebarBg: 'bg-purple-800',
      navbarBg: 'bg-purple-600',
      navbarBtn1Bg: 'bg-purple-700',
      navbarBtn2Bg: 'bg-purple-500',
      navbarDropdownBg: 'bg-purple-400',
      navbarText: 'text-purple-100',
      sidebarText: 'text-purple-200',
      sidebarHover: 'hover:bg-purple-700',
      sidebarBtnSelected: 'bg-purple-300',
      borderColor: 'border-purple-300',
      navbarHover: 'hover:bg-purple-500', 
    },
    mystic: { 
      editorBg: 'bg-gray-950',
      editorText: 'text-gray-200', 
      sidebarBg: 'bg-gray-900',
      navbarBg: 'bg-indigo-700',
      navbarBtn1Bg: 'bg-indigo-600',
      navbarBtn2Bg: 'bg-indigo-500',
      navbarDropdownBg: 'bg-indigo-400',
      navbarText: 'text-indigo-100',
      sidebarText: 'text-gray-300',
      sidebarHover: 'hover:bg-indigo-800',
      sidebarBtnSelected: 'bg-indigo-300',
      borderColor: 'border-indigo-400', 
      navbarHover: 'hover:bg-indigo-600',
    },
  };
  
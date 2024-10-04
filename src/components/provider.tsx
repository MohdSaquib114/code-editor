import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { Theme, themes } from '../lib/Theme';

export interface File {
  id: string;
  name: string;
  content: string;
}

export interface Folder {
  id: string;
  name: string;
  files: File[];
  subfolders: Folder[];
}

interface FileContextType {
  folders: Folder[];
  currentFile: File | null;
  addFolder: (parentFolderId: string | null, folderName: string) => void;
  deleteFolder: (parentFolderId: string | null, folderId: string) => void;
  addFile: (parentFolderId: string, fileName: string) => void;
  deleteFile: (parentFolderId: string, fileId: string) => void;
  openFile: (fileId: string) => void;
  closeFile: () => void;
  updateFileContent: (fileId: string, newContent: string) => void;
  saveChanges: () => void;
  currentLang: string
  setCurrentLang: (currentLang:string) => void;
  currentTheme: Theme;
  setTheme : (currentTheme:Theme) => void
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [folders, setFolders] = useState<Folder[]>(() => {
    const savedFolders = localStorage.getItem('folders');
    return savedFolders ? JSON.parse(savedFolders) : [];
  });
  const [currentLang,setCurrentLang] = useState('js')
  const [currentTheme, setTheme] = useState<Theme>(themes.default)
  const [currentFile, setCurrentFile] = useState<File | null>(()=> {
    const saveFile = localStorage.getItem('currentfile');
    return saveFile ? JSON.parse(saveFile) :  { id: uuidv4(),
    name: "Welcome",
    content: "Welcome! Create a new file or folder to get started."}
  });

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
    localStorage.setItem('currentfile', JSON.stringify(currentFile));
  }, [folders,currentFile]);

  const addFolder = (parentFolderId: string | null, folderName: string) => {
    const newFolder: Folder = {
      id: uuidv4(),
      name: folderName,
      files: [],
      subfolders: [],
    };

    if (parentFolderId === null) {
      setFolders((prevFolders) => [...prevFolders, newFolder]);
    } else {
      const updatedFolders = [...folders];
      const addSubfolder = (folderList: Folder[]) => {
        folderList.forEach((folder) => {
          if (folder.id === parentFolderId) {
            folder.subfolders.push(newFolder);
          } else {
            addSubfolder(folder.subfolders);
          }
        });
      };
      addSubfolder(updatedFolders);
      setFolders(updatedFolders);
    }
  };

  const deleteFolder = (parentFolderId: string | null, folderId: string) => {
    if (parentFolderId === null) {
      setFolders((prevFolders) => prevFolders.filter((folder) => folder.id !== folderId));
    } else {
      const updatedFolders = [...folders];
      const removeSubfolder = (folderList: Folder[]) => {
        folderList.forEach((folder) => {
          folder.subfolders = folder.subfolders.filter((subfolder) => subfolder.id !== folderId);
          removeSubfolder(folder.subfolders);
        });
      };
      removeSubfolder(updatedFolders);
      setFolders(updatedFolders);
    }
  };

  const addFile = (parentFolderId: string, fileName: string) => {
    const newFile: File = {
      id: uuidv4(),
      name: fileName + `.${currentLang}`,
      content: "//Write your code here",
    };
    const updatedFolders = [...folders];
    const addFileToFolder = (folderList: Folder[]) => {
      folderList.forEach((folder) => {
        if (folder.id === parentFolderId) {
          folder.files.push(newFile);
        } else {
          addFileToFolder(folder.subfolders);
        }
      });
    };
    addFileToFolder(updatedFolders);
    setFolders(updatedFolders);
  };

  const deleteFile = (parentFolderId: string, fileId: string) => {
    const updatedFolders = [...folders];
    const removeFileFromFolder = (folderList: Folder[]) => {
      folderList.forEach((folder) => {
        if (folder.id === parentFolderId) {
          folder.files = folder.files.filter((file) => file.id !== fileId);
        } else {
          removeFileFromFolder(folder.subfolders);
        }
      });
    };
    removeFileFromFolder(updatedFolders);
    setFolders(updatedFolders);
  };

  const openFile = (fileId: string) => {
    const findFile = (folderList: Folder[]): File | null => {
      for (const folder of folderList) {
        const file = folder.files.find((file) => file.id === fileId);
        if (file) return file;
        const subfile = findFile(folder.subfolders);
        if (subfile) return subfile;
      }
      return null;
    };

    const file = findFile(folders);
    if (file) {
      setCurrentFile(file);
    }
  };

  const closeFile = () => {
    setCurrentFile(null);
  };

  const updateFileContent = (fileId: string, newContent: string) => {
    const updatedFolders = [...folders];
    const updateContent = (folderList: Folder[]) => {
      folderList.forEach((folder) => {
        folder.files.forEach((file) => {
          if (file.id === fileId) {
            file.content = newContent;
          }
        });
        updateContent(folder.subfolders);
      });
    };
    updateContent(updatedFolders);
    setFolders(updatedFolders);

    if (currentFile?.id === fileId) {
      setCurrentFile((prevFile) => prevFile ? { ...prevFile, content: newContent } : null);
    }
  };

  const saveChanges = () => {
    if (folders.length > 0) {
        localStorage.setItem('folders', JSON.stringify(folders))
      }
  }

  return (
    <FileContext.Provider value={{ currentTheme, setTheme,folders, currentFile, addFolder, deleteFolder, addFile, deleteFile, openFile, closeFile, updateFileContent,saveChanges,currentLang,setCurrentLang }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};


import React, { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, Plus, Trash2, X, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Folder as FolderType, useFileContext } from './provider'
import JsIcon from './icon/JsIcon'
import TsIcon from './icon/TsIcon'
import { themes } from '../lib/Theme'

export default function FileExplorer() {
  const { folders, addFolder, deleteFolder, addFile, deleteFile, openFile, currentFile, currentLang, setTheme, currentTheme } = useFileContext()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [newItemName, setNewItemName] = useState('')
  const [creatingIn, setCreatingIn] = useState<{ folderId: string | null, type: 'file' | 'folder' } | null>(null)
  const [selectedOption, setSelectedOption] = useState('Select Theme')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prevExpandedFolders) => {
      const newExpandedFolders = new Set(prevExpandedFolders)
      if (newExpandedFolders.has(folderId)) {
        newExpandedFolders.delete(folderId)
      } else {
        newExpandedFolders.add(folderId)
      }
      return newExpandedFolders
    })
  }

  const handleCreateNew = (folderId: string | null, type: 'file' | 'folder') => {
    setCreatingIn({ folderId, type })
    setNewItemName('')
  }

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault()
    if (creatingIn && newItemName.trim()) {
      if (creatingIn.type === 'file') {
        addFile(creatingIn.folderId as string, newItemName.trim())
      } else {
        addFolder(creatingIn.folderId, newItemName.trim())
      }
      setCreatingIn(null)
      setNewItemName('')
    }
  }

  const renderFolders = (folders: FolderType[], parentFolderId: string | null = null) => {
    return folders.map((folder) => (
      <div key={folder.id} className="pl-4">
        <div className="flex items-center group">
          <button 
            type='button'
            title='expand folder'
            className={`p-1 hover:${currentTheme.sidebarHover} rounded-sm`}
            onClick={() => toggleFolder(folder.id)}
          >
            {expandedFolders.has(folder.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <Folder size={16} className="mr-1" />
          <span className="flex-grow">{folder.name}</span>
          <div className="hidden group-hover:flex">
            <button 
              type='button'
              title='Add File'
              className={`p-1 hover:${currentTheme.sidebarHover} rounded-sm`}
              onClick={() => handleCreateNew(folder.id, 'file')}
            >
              <Plus size={14} />
            </button>
            <button 
              type='button'
              title='Add Folder'
              className={`p-1 hover:${currentTheme.sidebarHover} rounded-sm`}
              onClick={() => handleCreateNew(folder.id, 'folder')}
            >
              <Folder size={14} />
            </button>
            <button
              type='button' 
              title='Delete Folder'
              className={`p-1 hover:${currentTheme.sidebarHover} rounded-sm`}
              onClick={() => deleteFolder(parentFolderId, folder.id)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        {expandedFolders.has(folder.id) && (
          <div>
            {folder.files.map((file) => (
              <div onClick={() => openFile(file.id)} key={file.id} className={`${file.id === currentFile?.id ? currentTheme.sidebarBtnSelected : ""} flex items-center group cursor-pointer pl-6 m-1`}>
                {currentLang === "js" ? <JsIcon /> : <TsIcon />}
                <span className="flex-grow">{file.name}</span>
                <button
                  title='Delete File' 
                  type='button'  
                  className={`hidden group-hover:block p-1 hover:${currentTheme.sidebarHover} rounded-sm`}
                  onClick={(e) => { e.stopPropagation(); deleteFile(folder.id, file.id); }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {renderFolders(folder.subfolders, folder.id)}
          </div>
        )}
        {creatingIn && creatingIn.folderId === folder.id && (
          <form onSubmit={handleSubmitNew} className="flex items-center pl-6 mt-1">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`New ${creatingIn.type} name`}
              className={`${currentTheme.sidebarBg} flex-grow border rounded-sm px-1 py-0.5 text-sm`}
              autoFocus
            />
            <button title='Add' type='submit' className={`p-1 hover:${currentTheme.sidebarHover} rounded-sm`}>
              <Plus size={14} />
            </button>
            <button title='Cancel' type='button' onClick={() => setCreatingIn(null)} className={`p-1 hover:${currentTheme.sidebarHover} rounded-sm`}>
              <X size={14} />
            </button>
          </form>
        )}
      </div>
    ))
  }

  return (
    <>
      <div 
        className={`${currentTheme.sidebarBg} ${currentTheme.sidebarText}  h-full overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-0' : 'w-64'
        }`}
      >
        <div className="w-64 h-full overflow-y-auto">
          <div className="flex items-center p-2 text-sm font-semibold sticky top-0 z-10 border-b">
            <button 
              onClick={() => setIsCollapsed(true)} 
              title='Collapse sidebar' 
              type='button' 
              className={`p-1 hover:${currentTheme.sidebarHover} rounded-sm`}
            >
              <ChevronsLeft size={16} />
            </button>
            <span className="ml-2">Explorer</span>
          </div>
          <div className="explorer border-b py-3">
            {renderFolders(folders)}
            <div className="p-2">
              {creatingIn && creatingIn.folderId === null ? (
                <form onSubmit={handleSubmitNew} className="flex items-center">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="New root folder name"
                    className={`${currentTheme.sidebarBg} flex-grow border rounded-sm px-1 py-0.5 text-sm`}
                    autoFocus
                  />
                  <button title='Add Folder' type="submit" className={`p-1 hover:${currentTheme.sidebarHover} rounded-sm`}>
                    <Plus size={14} />
                  </button>
                  <button title='Cancel' type='button' onClick={() => setCreatingIn(null)} className={`p-1 hover:${currentTheme.sidebarHover} rounded-sm`}>
                    <X size={14} />
                  </button>
                </form>
              ) : (
                <button 
                  type='button'
                  className={`w-full text-left p-1 hover:${currentTheme.sidebarHover} rounded-sm`}
                  onClick={() => handleCreateNew(null, 'folder')}
                >
                  <Plus size={14} className="inline mr-1" />
                  Add Root Folder
                </button>
              )}
            </div>
          </div>
          <div className="relative py-3 px-5 space-y-4 justify-center">
            <p className='text-sm font-medium'>Change Theme</p>
            <button
              type='button'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`px-3 py-1 text-sm border rounded hover:${currentTheme.sidebarHover} focus:outline-none focus:ring-2 focus:ring-gray-200`}
            >
              {selectedOption}
              <span className="ml-2">▼</span>
            </button>
            {isDropdownOpen && (
              <div className={`absolute mt-2 w-44 ${currentTheme.sidebarBg} border rounded shadow-lg`}>
                {['default', 'dark', 'twilight', 'mystic'].map((option) => (
                  <button
                    type='button'
                    key={option}
                    onClick={() => {
                      setSelectedOption(option)
                      setTheme(themes[option])
                      setIsDropdownOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:${currentTheme.sidebarText} focus:outline-none focus:${currentTheme.sidebarHover}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          title='Expand sidebar'
          type='button'
          className={`fixed top-[70px] left-3 px-2 py-1 ${currentTheme.sidebarBg} ${currentTheme.sidebarText} hover:${currentTheme.sidebarHover} rounded-md`}
        >
          <ChevronsRight size={16} />
        </button>
      )}
    </>
  )
}

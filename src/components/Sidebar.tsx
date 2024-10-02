import React, { useState } from 'react'
import { ChevronRight, ChevronDown, File, Folder, Plus, Trash2, X } from 'lucide-react'
import { Folder as FolderType, useFileContext } from './provider'

export default function FileExplorer() {
  const { folders, addFolder, deleteFolder, addFile, deleteFile, openFile } = useFileContext()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [newItemName, setNewItemName] = useState('')
  const [creatingIn, setCreatingIn] = useState<{ folderId: string | null, type: 'file' | 'folder' } | null>(null)

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
        //@ts-ignore
        addFile(creatingIn.folderId, newItemName.trim())
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
            className="p-1 hover:bg-gray-100 rounded-sm"
            onClick={() => toggleFolder(folder.id)}
          >
            {expandedFolders.has(folder.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <Folder size={16} className="mr-1" />
          <span className="flex-grow">{folder.name }</span>
          <div className="hidden group-hover:flex">
            <button 
              className="p-1 hover:bg-gray-100 rounded-sm"
              onClick={() => handleCreateNew(folder.id, 'file')}
            >
              <Plus size={14} />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded-sm"
              onClick={() => handleCreateNew(folder.id, 'folder')}
            >
              <Folder size={14} />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded-sm"
              onClick={() => deleteFolder(parentFolderId, folder.id)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        {expandedFolders.has(folder.id) && (
          <div>
            {folder.files.map((file) => (
              <div onClick={() => openFile(file.id)} key={file.id} className="flex items-center group pl-6">
                <File size={16} className="mr-1" />
                <span className="flex-grow">{file.name}</span>
                <button 
                  className="hidden group-hover:block p-1 hover:bg-gray-100 rounded-sm"
                  onClick={() => deleteFile(folder.id, file.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {renderFolders(folder.subfolders, folder.id)}
           
          </div>
        )}
        { creatingIn && creatingIn.folderId === folder.id && (
                
                <form onSubmit={handleSubmitNew} className="flex items-center pl-6 mt-1">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={`New ${creatingIn.type} name`}
                    className="flex-grow border rounded-sm px-1 py-0.5 text-sm"
                    autoFocus
                  />
                  <button type="submit" className="p-1 hover:bg-gray-100 rounded-sm">
                    <Plus size={14} />
                  </button>
                  <button type="button" onClick={() => setCreatingIn(null)} className="p-1 hover:bg-gray-100 rounded-sm">
                    <X size={14} />
                  </button>
                </form>
              )}
      </div>
    ))
  }

  return (
    <div className="w-64 h-screen border-r overflow-y-auto">
      <div className="flex items-center p-2 text-sm font-semibold sticky top-0 bg-white z-10 border-b">
        <button className="p-1 hover:bg-gray-100 rounded-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <span className="ml-2">Explorer</span>
      </div>
      <div className="explorer">
        {renderFolders(folders)}
        <div className="p-2">
          {creatingIn && creatingIn.folderId === null ? (
            <form onSubmit={handleSubmitNew} className="flex items-center">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="New root folder name"
                className="flex-grow border rounded-sm px-1 py-0.5 text-sm"
                autoFocus
              />
              <button type="submit" className="p-1 hover:bg-gray-100 rounded-sm">
                <Plus size={14} />
              </button>
              <button type="button" onClick={() => setCreatingIn(null)} className="p-1 hover:bg-gray-100 rounded-sm">
                <X size={14} />
              </button>
            </form>
          ) : (
            <button 
              className="w-full text-left p-1 hover:bg-gray-100 rounded-sm"
              onClick={() => handleCreateNew(null, 'folder')}
            >
              <Plus size={14} className="inline mr-1" />
              Add Root Folder
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


import { useState } from 'react'
import { useFileContext } from './provider'
import { languageOptions } from '../lib/languageOption'
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const [selectedOption, setSelectedOption] = useState('Select Language')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const {currentFile,updateFileContent,saveChanges,setCurrentLang,currentTheme} = useFileContext()

  const resetCode = () => {
       updateFileContent(currentFile?.id as string,"//Start writing code here")
       toast.success(`Reset code of ${currentFile?.name }`)
      
    }
  const saveCode = () => {
    saveChanges();
    toast.success('Save changes')
  }

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  return (
    <nav className={`${currentTheme.navbarBg} ${currentTheme.borderColor} ${currentTheme.navbarText} transition-all duration-300 ease-in-out flex items-center justify-between p-4 border-b`}>
      <div className="text-lg font-semibold">
        CodeForge
      </div>
      <div className="flex items-center space-x-4">
      <span className="text-sm font-medium">{currentFile?.name}</span>
      <div className="relative">
          <button
          type='button'
            onClick={toggleDropdown}
            className={`px-3 py-1 text-sm border rounded hover:${currentTheme.navbarHover} focus:outline-none focus:ring-2 focus:${currentTheme.borderColor}`}
          >
            {selectedOption}
            <span className="ml-2">▼</span>
          </button>
          {isDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-48 ${currentTheme.navbarBg} border rounded shadow-lg`}>
              {languageOptions.map((option) => (
                <button
                  key={option.langCode}
                  onClick={() => {
                    setSelectedOption(option.langName)
                    setCurrentLang(option.langCode)
                    setIsDropdownOpen(false)
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:${currentTheme.navbarHover} focus:outline-none focus:${currentTheme.borderColor}`}
                >
                  {option.langName}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={saveCode} type='button' className={`px-3 py-1 text-sm border rounded hover:${currentTheme.navbarHover} focus:outline-none focus:ring-2 focus:${currentTheme.borderColor}`}>
          Save
        </button>
        <button type='button' onClick={resetCode} className={`px-3 py-1 text-sm border rounded hover:${currentTheme.navbarHover} focus:outline-none focus:ring-2 focus:${currentTheme.borderColor}`}>
          Reset
        </button>
        
       
      </div>
    </nav>
  )
}
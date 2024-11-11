"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createJournal, updateJournal } from "./api";
import { Paperclip, X, FileIcon } from "lucide-react";

export default function JournalSection({ journals = [] }) {
  const [journalData, setJournalData] = useState({
    notes: "",
    mistakes: "",
    lessons: "",
  });
  const [files, setFiles] = useState([]);
  const [todayJournal, setTodayJournal] = useState(null);
  const [savingStatus, setSavingStatus] = useState("");

  useEffect(() => {
    if (journals.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const journalForToday = journals.find((journal) =>
        journal.date.startsWith(today)
      );
      if (journalForToday) {
        setTodayJournal(journalForToday);
        setJournalData({
          notes: journalForToday.notes,
          mistakes: journalForToday.mistakes,
          lessons: journalForToday.lessons,
        });
      }
    }
  }, [journals]);

  useEffect(() => {
    // Clean up object URLs when component unmounts
    return () => {
      files.forEach((file) => {
        if (file.preview && file.preview.startsWith("blob:")) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const autoSaveJournal = useCallback(
    debounce(async (data) => {
      setSavingStatus("Saving...");
      try {
        if (todayJournal) {
          await updateJournal(todayJournal._id, data);
        } else {
          await createJournal(data);
        }
        setSavingStatus("Saved");
        setTimeout(() => setSavingStatus(""), 3000);
      } catch (error) {
        console.error("Error saving journal:", error);
        setSavingStatus("Error saving");
      }
    }, 1000),
    [todayJournal]
  );

  const handleJournalChange = (e) => {
    const newJournalData = { ...journalData, [e.target.name]: e.target.value };
    setJournalData(newJournalData);
    autoSaveJournal(newJournalData);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...selectedFiles]
        .slice(0, 3)
        .map((file) => {
          if (file.type.startsWith("image/")) {
            return Object.assign(file, {
              preview: URL.createObjectURL(file),
            });
          }
          return file;
        });
      return newFiles;
    });
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles[index];
      if (fileToRemove.preview && fileToRemove.preview.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter((_, i) => i !== index);
    });
  };

  return (
    <Card className="flex-1">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-lg font-semibold">
          Today&apos;s Journal{" "}
          <span className="text-sm font-light">
            {savingStatus && `(${savingStatus})`}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={journalData.notes}
            onChange={handleJournalChange}
            placeholder="Type your notes here..."
          />
        </div>
        <div>
          <Label htmlFor="mistakes">Mistake</Label>
          <Textarea
            id="mistakes"
            name="mistakes"
            value={journalData.mistakes}
            onChange={handleJournalChange}
            placeholder="Type your mistakes here..."
          />
        </div>
        <div>
          <Label htmlFor="lessons">Lesson</Label>
          <Textarea
            id="lessons"
            name="lessons"
            value={journalData.lessons}
            onChange={handleJournalChange}
            placeholder="Type your lessons here..."
          />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1 overflow-hidden">
            {files.length > 0 ? (
              <ul className="flex space-x-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="relative bg-secondary/50 rounded-md w-16 h-8 overflow-hidden"
                  >
                    {file.type.startsWith("image/") ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileIcon className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    <Button
                      variant="secondaryyy"
                      size="sm"
                      className="absolute top-0 right-0 p-0 h-4 w-4"
                      onClick={() => handleRemoveFile(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-sm text-muted-foreground">
                No files selected
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {files.length}/3
            </span>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => document.getElementById("file-upload").click()}
              disabled={files.length >= 3} // Disable when 3 files are selected
            >
              <Paperclip className="w-4 h-4" />
              <span>Attach</span>
            </Button>
          </div>
        </div>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/*,application/pdf"
          aria-label="Upload files"
        />
      </CardContent>
    </Card>
  );
}

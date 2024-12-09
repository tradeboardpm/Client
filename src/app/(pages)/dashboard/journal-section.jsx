import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import Cookies from "js-cookie";
import debounce from "lodash/debounce";

export function JournalSection({ selectedDate }) {
  const [journal, setJournal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localJournal, setLocalJournal] = useState({
    note: " ",
    mistake: " ",
    lesson: " ",
  });
  const [files, setFiles] = useState([]);

  // Utility function to get UTC date
  const getUTCDate = (date) => {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  };

  // Fetch journal data
  const fetchJournalData = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const utcDate = getUTCDate(selectedDate);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/journals`,
        {
          params: { date: utcDate.toISOString() },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJournal(response.data);
    } catch (error) {
      console.error("Error fetching journal data:", error);
      setJournal(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Save journal function
  const saveJournal = async (journalData) => {
    if (!journalData) return;

    setIsSaving(true);
    try {
      const token = Cookies.get("token");
      const utcDate = getUTCDate(selectedDate);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/journals`,
        {
          ...journalData,
          date: utcDate.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJournal(response.data);
    } catch (error) {
      console.error("Error saving journal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced save function
  const debouncedSaveJournal = useCallback(
    debounce(saveJournal, 5000), // 5000ms (5 seconds) debounce time
    [selectedDate]
  );

  // Update journal entries
const handleChange = (e) => {
  const { name, value } = e.target;
  const updatedJournal = {
    ...localJournal,
    [name]: value || " ", // Use single space if value is empty or undefined
  };

  setLocalJournal(updatedJournal);
  debouncedSaveJournal(updatedJournal);
};

  // Handle blur event
  const handleBlur = () => {
    debouncedSaveJournal.cancel(); // Cancel any pending debounced saves
    saveJournal(localJournal); // Immediately save on blur
  };

  // File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("image/")) {
      alert("Please upload only image files");
      return;
    }

    if (files.length >= 3) {
      alert("Maximum 3 files allowed");
      return;
    }

    const formData = new FormData();
    formData.append("attachedFiles", file);
    const utcDate = getUTCDate(selectedDate);
    formData.append("date", utcDate.toISOString());

    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/journals`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setJournal(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // File deletion handler
  const handleFileDelete = async (fileKey) => {
    try {
      const token = Cookies.get("token");
      const filename = fileKey.split("/").pop();

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/journals/${journal._id}/file/${filename}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchJournalData();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // Fetch journal data on date change
  useEffect(() => {
    fetchJournalData();
  }, [selectedDate]);

  // Update local journal and files when journal data changes
  useEffect(() => {
    if (journal) {
      setLocalJournal({
        note: journal.note || "",
        mistake: journal.mistake || "",
        lesson: journal.lesson || "",
      });
      setFiles(journal.attachedFiles || []);
    }
  }, [journal]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSaveJournal.cancel();
    };
  }, [debouncedSaveJournal]);

  if (isLoading) {
    return <div>Loading journal...</div>;
  }

  return (
    <Card className="flex-1 w-full h-full flex justify-between flex-col pb-6">
      <CardHeader>
        <CardTitle className="flex text-xl items-center gap-2">
          Today's Journal
          {isSaving && (
            <span className="text-sm font-normal text-muted-foreground">
              (Saving...)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            name="note"
            placeholder="Type your notes here..."
            value={localJournal.note}
            onChange={handleChange}
            onBlur={handleBlur}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mistakes</label>
          <Textarea
            name="mistake"
            placeholder="Type your mistakes here..."
            value={localJournal.mistake}
            onChange={handleChange}
            onBlur={handleBlur}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Lessons</label>
          <Textarea
            name="lesson"
            placeholder="Type your lessons here..."
            value={localJournal.lesson}
            onChange={handleChange}
            onBlur={handleBlur}
            className="resize-none"
          />
        </div>
      </CardContent>
      <CardFooter className="h-fit p-0 px-6 flex items-center justify-between ">
       
          <div className="flex flex-wrap gap-2">
            {files.map((fileKey, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden w-20 h-9 shadow border"
              >
                <img
                  src={fileKey}
                  alt={`Uploaded file ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleFileDelete(fileKey)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity shadow border"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileUpload}
          />

          <Button
            variant="outline"
            className={cn(
              "w-fit",
              files.length >= 3 && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={files.length >= 3}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Attach
          </Button>

      </CardFooter>
    </Card>
  );
}

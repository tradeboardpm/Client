"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function Journals({
  journal,
  handleJournalChange,
  handleAttachFile,
  handleDeleteAttachment,
  isJournalSaving,
}) {
  const [attachments, setAttachments] = useState(journal.attachments || []);

  const isAttachmentLimitReached = attachments.length >= 3;

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only PNG, JPG, and JPEG files are allowed.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should not exceed 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Check attachment limit
    if (isAttachmentLimitReached) {
      toast({
        title: "Attachment limit reached",
        description: "You can only attach up to 3 files.",
        variant: "destructive",
      });
      return;
    }

    handleAttachFile(e);
    setAttachments([...attachments, file.name]);
  };

  const onDeleteAttachment = (attachment) => {
    handleDeleteAttachment(attachment);
    setAttachments(attachments.filter((a) => a !== attachment));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-3">
          Journal{" "}
          {isJournalSaving && <p className="text-sm font-light">Saving...</p>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <Textarea
              id="notes"
              value={journal.notes}
              onChange={handleJournalChange("notes")}
              rows={3}
            />
          </div>
          <div>
            <label
              htmlFor="lessons"
              className="block text-sm font-medium text-gray-700"
            >
              Lessons
            </label>
            <Textarea
              id="lessons"
              value={journal.lessons}
              onChange={handleJournalChange("lessons")}
              rows={3}
            />
          </div>
          <div>
            <label
              htmlFor="mistakes"
              className="block text-sm font-medium text-gray-700"
            >
              Mistakes
            </label>
            <Textarea
              id="mistakes"
              value={journal.mistakes}
              onChange={handleJournalChange("mistakes")}
              rows={3}
            />
          </div>
          <div className="flex gap-4 flex-row-reverse">
            <input
              type="file"
              onChange={onFileChange}
              className="hidden"
              id="file-upload"
              accept=".png,.jpg,.jpeg"
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer bg-background text-primary w-fit border border-ring p-1.5 hover:bg-secondary rounded-lg flex gap-2 ${
                isAttachmentLimitReached ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Image /> Attach
            </label>
            <div className="flex gap-2 items-center">
              {attachments.map((attachment) => (
                <div
                  key={attachment}
                  className="relative w-20 rounded-lg border shadow-md "
                >
                  <img
                    src={`https://tradeboardjournals.s3.ap-south-1.amazonaws.com/${attachment}`}
                    alt="attachment"
                    className="h-10 w-full object-fill rounded-lg"
                  />
                  <Button
                    onClick={() => onDeleteAttachment(attachment)}
                    variant="ghost"
                    size="sm"
                    className="p-0 bg-secondary rounded-full h-4 w-4 border shadow-sm absolute -top-1 -right-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

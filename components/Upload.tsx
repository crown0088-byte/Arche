import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { useOutletContext } from "react-router";
import { Upload as UploadIcon, CheckCircle2, Image as ImageIcon } from "lucide-react";
// Import timing configurations explicitly from your constants file
import { PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from "../lib/constants";

interface AuthContext {
    isSignedIn: boolean;
}

interface UploadProps {
    onComplete: (base64Image: string) => void;
}

export default function Upload({ onComplete }: UploadProps) {
    const { isSignedIn } = useOutletContext<AuthContext>();

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Clean up timers on component unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Centralized processing logic handling file reader stream configurations
    const processFile = (selectedFile: File) => {
        // Structural Guard: Block processing execution if user session is invalid
        if (!isSignedIn) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!allowedTypes.includes(selectedFile.type)) {
            alert("Please upload a valid image file (JPG, PNG, or WEBP).");
            return;
        }

        setFile(selectedFile);
        setProgress(0);

        const reader = new FileReader();

        reader.onload = (event) => {
            const base64String = event.target?.result as string;

            // Clear any loose active execution loops before generating a new process cycle
            if (intervalRef.current) clearInterval(intervalRef.current);

            intervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        if (intervalRef.current) clearInterval(intervalRef.current);

                        // Execute the final navigation transition callback after target delay
                        timeoutRef.current = setTimeout(() => {
                            onComplete(base64String);
                        }, REDIRECT_DELAY_MS);

                        return 100;
                    }
                    return prev + PROGRESS_STEP;
                });
            }, PROGRESS_INTERVAL_MS);
        };

        reader.onerror = () => {
            alert("Failed to process your floor plan file. Please try again.");
            setFile(null);
        };

        reader.readAsDataURL(selectedFile);
    };

    // Input listener handling click manual choices
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    // Drag and Drop Route Handlers
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (isSignedIn) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (!isSignedIn) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="upload">
            {!file ? (
                <div
                    className={`dropzone ${isDragging ? "is-dragging" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="drop-input"
                        accept=".jpg,.jpeg,.png,.webp"
                        disabled={!isSignedIn}
                        onChange={handleFileChange}
                    />
                    <div className="drop-content">
                        <div className="drop-icon">
                            <UploadIcon size={20} />
                        </div>
                        <p>
                            {isSignedIn
                                ? "Click to upload or drag and drop"
                                : "Sign in to your account with Puter to upload"}
                        </p>
                        <p className="help">Maximum file size 50MB.</p>
                    </div>
                </div>
            ) : (
                <div className="upload-status">
                    <div className="status-content">
                        <div className="status-icon">
                            {progress === 100 ? (
                                <CheckCircle2 className="check" />
                            ) : (
                                <ImageIcon className="image" />
                            )}
                        </div>
                        <h3>{file.name}</h3>

                        <div className="progress">
                            <div className="bar" style={{ width: `${progress}%` }} />
                        </div>

                        <p className="status-text">
                            {progress < 100 ? "Analyzing floor plan..." : "Redirecting..."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
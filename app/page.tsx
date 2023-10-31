"use client";
import React, { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function Home() {
  // State variables for video upload
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append('video', file);
    }
    else {
      console.error("No file selected");
      return;
  
    }
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await axios.post('http://localhost:3000/videos/upload', formData);
      console.log('Video uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  const handleVideoSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/videos/search?title=${searchTitle}`);
      setSearchResults(response.data);
      console.log("fetch video successfully");
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  return (
    <main className={styles.main}>
      {/* Upload Video Section */}
      <section className={styles.uploadSection}>
        <h1>Upload Video</h1>
        <form onSubmit={handleUpload}>
          <div>
            <label>Title:</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <input 
              type="file" 
              accept="video/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                }
            }}           />
          </div>
          <button type="submit">Submit</button>
        </form>
      </section>
      <section className={styles.searchSection}>
        <h1>Search Video</h1>
        <div>
          <input 
            type="text" 
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Enter video title"
          />
          <button onClick={handleVideoSearch}>Search</button>
        </div>

        {searchResults.map(video => (
          <div key={video.video_id}>
            <h2>{video.title}</h2>
            <p>{video.description}</p>
            <video controls width="640" height="360">
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </section>
    </main>
  );
}

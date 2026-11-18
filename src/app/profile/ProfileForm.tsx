"use client";

import { useState } from "react";
import { User } from "../api/model";
import styles from "./profile.module.css";

export function ProfileForm({ user }: { user: User }) {
  const [pictureUrl, setPictureUrl] = useState(user.picture);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // Save the profile. Get fields value by input name
    const handle = (e.target as any).handle.value;
    const name = (e.target as any).name.value;
    const picture = pictureUrl;

    // Save the profile
    const response = await fetch("/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ handle, picture, name }),
    });

    if (response.ok) {
      setSuccessMessage("Profile saved");
      setErrorMessage("");
    } else {
      const data = await response.json();
      setSuccessMessage("");
      setErrorMessage(data.error);
    }
  };

  return (
    <form onSubmit={saveProfile} className={styles.form}>
      <h1>Your profile</h1>

      <div className={styles.field}>
        <label htmlFor="staticEmail">Email</label>
        <input
          type="text"
          readOnly={true}
          className="form-control"
          id="staticEmail"
          name="email"
          value={user.email}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          defaultValue={user.name}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="handle">Handle</label>
        <div className={styles.handle}>
          <span aria-hidden="true">@</span>
          <input
            type="text"
            className="form-control"
            id="handle"
            aria-describedby="handleHelp"
            name="handle"
            defaultValue={user.handle}
          />
        </div>
        <small id="handleHelp">Shown next to your ideas and comments.</small>
      </div>

      <div className={styles.field}>
        <label htmlFor="pic">Profile picture URL</label>
        <div className={styles.picture}>
          <img src={pictureUrl} alt="" />
          <input
            type="url"
            className="form-control"
            id="pic"
            aria-describedby="picHelp"
            defaultValue={pictureUrl}
            onBlur={(e) => {
              setPictureUrl(e.target.value);
            }}
          />
        </div>
        <small id="picHelp">
          Uploads aren&apos;t available yet, so paste a link to an image.
        </small>
      </div>

      <div className={styles.footer}>
        <button type="submit" className="btn btn-primary">
          Save profile
        </button>
        {successMessage && (
          <span className={styles.success} role="status">
            {successMessage}
          </span>
        )}
        {errorMessage && (
          <span className={styles.error} role="alert">
            {errorMessage}
          </span>
        )}
      </div>
    </form>
  );
}

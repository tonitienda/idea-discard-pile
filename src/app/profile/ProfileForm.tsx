"use client";

import { useState } from "react";
import { User } from "../api/model";
import { set } from "date-fns";

export function ProfileForm({ user }: { user: User }) {
  const [pictureUrl, setPictureUrl] = useState(user.picture);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const saveProfile = async (e: React.FormEvent) => {
    console.log("saveProfile");
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
    <>
      {errorMessage && (
        <div className="alert alert-dismissible alert-danger">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-dismissible alert-success">
          {successMessage}
        </div>
      )}
      <form onSubmit={saveProfile}>
        <fieldset>
          <div className="row">
            <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
              Email
            </label>

            <div className="col-sm-10">
              <input
                type="text"
                readOnly={true}
                className="form-control-plaintext"
                id="staticEmail"
                name="email"
                value={user.email}
              />
            </div>
          </div>
          <div>
            <label htmlFor="name" className="form-label mt-4">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              aria-describedby="nameHelp"
              placeholder="Enter name"
              name="name"
              defaultValue={user.name}
            />
            <small id="nameHelp" className="form-text text-muted">
              Your name
            </small>
          </div>
          <div>
            <label htmlFor="handle" className="form-label mt-4">
              Handle
            </label>
            <div className="input-group mb-3">
              <span className="input-group-text">@</span>

              <input
                type="text"
                className="form-control"
                id="handle"
                aria-describedby="handleHelp"
                placeholder="Enter handle"
                name="handle"
                defaultValue={user.handle}
              />
            </div>
            <small id="handleHelp" className="form-text text-muted">
              Your handle
            </small>
          </div>
          <div>
            <img
              src={pictureUrl}
              alt={user.name}
              style={{
                borderRadius: "50%",
                width: 50,
                height: 50,
                display: "block",
              }}
            />
            <label htmlFor="pic" className="form-label mt-4">
              Url to the profile picture
            </label>
            <input
              type="url"
              className="form-control"
              id="pic"
              aria-describedby="handleHelp"
              placeholder="Enter pic url"
              defaultValue={pictureUrl}
              onBlur={(e) => {
                setPictureUrl(e.target.value);
              }}
            />
            <small id="handleHelp" className="form-text text-muted">
              Picture cannot be uploaded just yet. Please use an url.
            </small>
          </div>
        </fieldset>
        <button type="submit" className="btn btn-primary mt-4">
          Save
        </button>
      </form>
    </>
  );
}

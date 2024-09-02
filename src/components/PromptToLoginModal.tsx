"use client";
import { useEffect, useState } from "react";

type PromptToLoginModalProps = {
  open: boolean;
};

export default function PromptToLoginModal({ open }: PromptToLoginModalProps) {
  const [isOpen, setOpen] = useState(open);

  // Synchronize the isOpen state with the open prop
  useEffect(() => {
    setOpen(open);
  }, [open]);

  return (
    <div className="modal" style={{ display: isOpen ? "block" : "none" }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Join the Community</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <span aria-hidden="true"></span>
            </button>
          </div>
          <div className="modal-body">
            <p>
              Log in to unlock the full experience! After logging in, you can
              react to ideas, share your own inspirations, and bookmark ideas
              that resonate with you. Become a part of our creative community
              and bring your ideas to life!
            </p>
          </div>
          <div className="modal-footer">
            <a href="/api/auth/login" className="btn btn-primary">
              Login or Register
            </a>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

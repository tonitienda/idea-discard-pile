export function trackIdeaReaction(ideaId, reactionType, action) {
  window.gtag("event", "react_to_idea", {
    event_category: "Reaction",
    event_label: reactionType, // e.g., 'like', 'dislike'
    value: ideaId,
    action_status: action, // e.g., 'enabled', 'disabled'
  });
}

export function trackIdeaCreation(ideaId, ideaTitle) {
  window.gtag("event", "add_idea", {
    event_category: "Idea",
    event_label: ideaTitle,
    value: ideaId,
  });
}

export function trackUserLogin(userId) {
  window.gtag("event", "login", {
    user_id: userId,
  });
}

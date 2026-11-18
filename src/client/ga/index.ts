export function trackIdeaReaction(ideaId, reactionType, action) {
  window.gtag("event", "react_to_idea", {
    event_category: "Reaction",
    event_label: "Reaction",
    value: ideaId,
    reaction_type: reactionType, // e.g., 'like', 'dislike'
    action_status: action, // e.g., 'enabled', 'disabled'
  });
}

export function trackIdeaCreation(ideaId, ideaTitle) {
  window.gtag("event", "add_idea", {
    event_category: "Idea",
    event_label: "Idea",
    value: ideaId,
    idea_title: ideaTitle,
  });
}

export function trackUserLogin(userId) {
  window.gtag("event", "login", {
    user_id: userId,
  });
}

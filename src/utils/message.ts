type MessageType = 'success' | 'error' | 'warning' | 'info';

const icons: Record<MessageType, string> = {
  success: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  error: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  warning: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  info: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
};

function createContainer(): HTMLDivElement {
  let container = document.getElementById('message-container') as HTMLDivElement;
  if (!container) {
    container = document.createElement('div');
    container.id = 'message-container';
    document.body.appendChild(container);
  }
  return container;
}

function showMessage(type: MessageType, content: string, duration: number = 3000) {
  // Ensure we run DOM operations only in browser context
  if (typeof window === 'undefined') return;

  const container = createContainer();

  const item = document.createElement('div');
  item.className = `message-item ${type}`;
  
  item.innerHTML = `
    <span class="message-icon">${icons[type]}</span>
    <span class="message-content">${content}</span>
  `;

  container.appendChild(item);

  // Trigger transition animation in next tick
  requestAnimationFrame(() => {
    item.classList.add('show');
  });

  // Auto clean up
  setTimeout(() => {
    item.classList.remove('show');
    item.classList.add('hide');
    
    // Wait for the slideOut hide transition (350ms) to complete before removing from DOM
    setTimeout(() => {
      item.remove();
      // Remove container as well if no messages are active
      if (container.children.length === 0) {
        container.remove();
      }
    }, 350);
  }, duration);
}

export const message = {
  success: (content: string, duration?: number) => showMessage('success', content, duration),
  error: (content: string, duration?: number) => showMessage('error', content, duration),
  warning: (content: string, duration?: number) => showMessage('warning', content, duration),
  info: (content: string, duration?: number) => showMessage('info', content, duration)
};

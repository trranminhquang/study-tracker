import '@assets/styles/tailwind.css';
import '@pages/popup/index.css';

import { createRoot } from 'react-dom/client';
import Popup from '@pages/popup/Popup';

function init() {
  const rootContainer = document.querySelector('#__root');
  if (!rootContainer) {
    throw new Error(
      "Root element with id '__root' not found. Unable to mount Popup component."
    );
  }

  rootContainer.classList.add('popup-root');
  const root = createRoot(rootContainer);
  root.render(<Popup />);
}

init();

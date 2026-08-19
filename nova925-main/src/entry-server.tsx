import { renderToString } from 'react-dom/server';
import { AppServer } from './App';

export function render(url: string) {
  const html = renderToString(<AppServer url={url} />);
  return { html };
}

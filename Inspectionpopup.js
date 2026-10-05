export function createInspectionPopup(record) {
  if (!record) return null;

  // Outer container
  const container = document.createElement('div');
  container.style.fontFamily = 'sans-serif';

  // Trigger Button
  const button = document.createElement('button');
  button.innerText = `View The Latest Health Inspection Results`;
  Object.assign(button.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '99999',
    padding: '10px 16px',
    backgroundColor: '#d32f2f',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  });

  // Modal Overlay (Hidden by default)
  const overlay = document.createElement('div');
  overlay.style.display = 'none';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '100000',
    justifyContent: 'center',
    alignItems: 'center',
  });

  // Modal White Box
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    width: '300px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    color: '#333333',
  });

  // Header Section
  const header = document.createElement('div');
  Object.assign(header.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
    paddingBottom: '8px',
  });

  const title = document.createElement('h2');
  title.innerText = 'NYC Inspection Record';
  title.style.margin = '0';
  title.style.fontSize = '18px';

  const closeBtn = document.createElement('button');
  closeBtn.innerText = '✕';
  Object.assign(closeBtn.style, {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#666',
  });

  header.appendChild(title);
  header.appendChild(closeBtn);

  // Body Section
  const body = document.createElement('div');
  body.style.marginTop = '12px';
  body.style.lineHeight = '1.6';

  body.innerHTML = `
    <p style="margin: 6px 0;"><strong>Restaurant:</strong> ${record.DBA || 'N/A'}</p>
    <p style="margin: 6px 0;"><strong>Grade:</strong> ${record.GRADE || 'N/A'}</p>
    <p style="margin: 6px 0;"><strong>Inspection Score:</strong> ${record.SCORE ?? 'N/A'}</p>
    <p style="margin: 6px 0;"><strong>Inspection Date:</strong> ${record["INSPECTION DATE"] || 'N/A'}</p>
    <p style="margin: 6px 0;"><strong>Inspection Type:</strong> ${record["INSPECTION TYPE"] || 'N/A'}</p>
    <p style="margin: 6px 0;"><strong>Violation Code:</strong> ${record["VIOLATION CODE"] || 'N/A'}</p>
    <p style="margin: 6px 0;"><strong>Violation Description:</strong> ${record["VIOLATION DESCRIPTION"] || 'N/A'}</p>
  `;

  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);

  container.appendChild(button);
  container.appendChild(overlay);

  // Toggle handlers
  button.addEventListener('click', () => {
    overlay.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.style.display = 'none';
    }
  });

  return container;
}
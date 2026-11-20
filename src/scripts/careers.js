// Careers page: "Apply for this role" preselects the role; the form composes an email.
const EMAIL = 'hello@erislabs.xyz';
const form = document.querySelector('[data-apply-form]');
const status = document.querySelector('[data-apply-status]');

document.querySelectorAll('[data-apply]').forEach(a => a.addEventListener('click', () => {
  if (form) form.role.value = a.dataset.apply;
  setTimeout(() => form?.name.focus({ preventScroll: true }), 600);
}));

// Opening a role via its URL hash (e.g. /careers#agent-engineer)
if (location.hash) {
  const d = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (d && d.tagName === 'DETAILS') d.open = true;
}

form?.addEventListener('submit', e => {
  e.preventDefault();
  const f = form.elements;
  const missing = ['name', 'email', 'message'].filter(n => !f[n].value.trim());
  if (!/^\S+@\S+\.\S+$/.test(f.email.value.trim()) && !missing.includes('email')) missing.push('email');
  form.querySelectorAll('label').forEach(l => l.classList.remove('is-invalid'));
  if (missing.length) {
    missing.forEach(n => f[n].closest('label').classList.add('is-invalid'));
    f[missing[0]].focus();
    status.textContent = 'Please fill in your name, a valid email and a short message.';
    return;
  }
  const subject = `Application: ${f.role.value} · ${f.name.value.trim()}`;
  const body = [
    `Name: ${f.name.value.trim()}`,
    `Email: ${f.email.value.trim()}`,
    `Role: ${f.role.value}`,
    `Time: ${f.time.value}`,
    `Links: ${f.links.value.trim() || '-'}`,
    '',
    f.message.value.trim(),
  ].join('\n');
  const url = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  // A mailto: target has no page to reach back through window.opener, so no 'noopener' flag here
  // (with it, window.open always returns null and the fallback would fire twice).
  const w = window.open(url, '_blank');
  if (!w) location.href = url;
  status.textContent = 'Your email app should open with the application ready to send. If it doesn’t, email ' + EMAIL + '.';
});

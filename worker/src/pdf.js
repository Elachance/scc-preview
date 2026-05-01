import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const W = 612;
const H = 792;
const ML = 50;
const MR = 562;
const CW = 512;
const MID = W / 2;
const COL2 = 312;

const BLACK = rgb(0, 0, 0);
const DGRAY = rgb(0.3, 0.3, 0.3);
const MGRAY = rgb(0.5, 0.5, 0.5);
const GREEN = rgb(0, 0.45, 0.1);

export async function generateRegistrationPDF(data) {
  const doc = await PDFDocument.create();
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);
  const boldItalic = await doc.embedFont(StandardFonts.HelveticaBoldOblique);
  const fonts = { reg, bold, italic, boldItalic };

  drawPage1(doc.addPage([W, H]), data, fonts);
  drawPage2(doc.addPage([W, H]), data, fonts);

  return await doc.save();
}

// ── helpers ──────────────────────────────────────────────────────────────────

function txt(page, str, x, y, font, size, color = BLACK) {
  if (!str) return 0;
  const s = String(str);
  page.drawText(s, { x, y, font, size, color });
  return font.widthOfTextAtSize(s, size);
}

function center(page, str, y, font, size, color = BLACK) {
  const w = font.widthOfTextAtSize(str, size);
  page.drawText(str, { x: MID - w / 2, y, font, size, color });
}

function hline(page, x1, x2, y, thickness = 0.5, color = MGRAY) {
  page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness, color });
}

function uline(page, x1, x2, y) {
  hline(page, x1, x2, y, 0.5, BLACK);
}

function box(page, x, y, checked, size = 9) {
  page.drawRectangle({ x, y, width: size, height: size, borderColor: BLACK, borderWidth: 0.75, color: rgb(1, 1, 1) });
  if (checked) {
    page.drawRectangle({ x: x + 2, y: y + 2, width: size - 4, height: size - 4, color: BLACK });
  }
}

function wrap(text, maxW, font, size) {
  const words = String(text).split(' ');
  const lines = [];
  let cur = '';
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= maxW) {
      cur = test;
    } else {
      if (cur) lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawWrapped(page, text, x, y, maxW, font, size, lh, color = BLACK) {
  for (const line of wrap(text, maxW, font, size)) {
    page.drawText(line, { x, y, font, size, color });
    y -= lh;
  }
  return y;
}

function formatDate(iso) {
  if (!iso) return '';
  const [yr, mo, da] = iso.split('-');
  return `${mo}/${da}/${yr}`;
}

function formatDOB(iso) {
  if (!iso) return '';
  const [yr, mo, da] = iso.split('-');
  return `${mo}/${da}/${yr.slice(2)}`;
}

// ── page 1 ───────────────────────────────────────────────────────────────────

function drawPage1(page, data, { reg, bold, italic, boldItalic }) {
  // Header
  center(page, 'Registration Agreement', 748, bold, 22);
  center(page, '2026 – 2027', 728, reg, 12);
  hline(page, ML, MR, 715, 0.75, BLACK);

  // Non-discrimination statement
  const disc = 'We accept children ages 2-6 years. We do not discriminate on the basis of race, color, religion, age, sex, disability, sexual orientation, or national and ethnic origin in our programs, admissions policies, employment, and general policies.';
  let y = 700;
  for (const line of wrap(disc, CW, reg, 7.5)) {
    center(page, line, y, reg, 7.5, DGRAY);
    y -= 10;
  }

  // Contact Information
  y -= 4;
  center(page, 'Contact Information  Please Print', y, bold, 10);
  y -= 17;

  // Child Name | DOB | Gender
  const cnL = 'Name of CHILD:';
  let x = ML;
  x += txt(page, cnL, x, y, bold, 9) + 3;
  txt(page, data.childName || '', x, y, reg, 9);
  uline(page, x, 272, y - 2);

  const dobL = 'DOB:';
  x = 277;
  x += txt(page, dobL, x, y, bold, 9) + 3;
  txt(page, formatDOB(data.dob), x, y, reg, 9);
  uline(page, x, 403, y - 2);

  const genL = 'Gender:';
  x = 408;
  x += txt(page, genL, x, y, bold, 9) + 3;
  txt(page, data.gender || '', x, y, reg, 9);
  uline(page, x, MR, y - 2);
  y -= 17;

  // Mailing Address
  x = ML;
  x += txt(page, 'Mailing Address:', x, y, bold, 9) + 3;
  txt(page, data.address || '', x, y, reg, 9);
  uline(page, x, MR, y - 2);
  y -= 17;

  // City | State | Zip
  x = ML;
  x += txt(page, 'City:', x, y, bold, 9) + 3;
  txt(page, data.city || '', x, y, reg, 9);
  uline(page, x, 228, y - 2);

  x = 233;
  x += txt(page, 'State:', x, y, bold, 9) + 3;
  txt(page, data.state || '', x, y, reg, 9);
  uline(page, x, 318, y - 2);

  x = 323;
  x += txt(page, 'Zip:', x, y, bold, 9) + 3;
  txt(page, data.zip || '', x, y, reg, 9);
  uline(page, x, 418, y - 2);
  y -= 17;

  // Primary Parent
  x = ML;
  x += txt(page, 'Name of Primary Parent/Guardian*:', x, y, bold, 9) + 3;
  txt(page, data.parent1Name || '', x, y, reg, 9);
  uline(page, x, MR, y - 2);
  y -= 17;

  x = ML;
  x += txt(page, 'Cell Phone:', x, y, bold, 9) + 3;
  txt(page, data.parent1Phone || '', x, y, reg, 9);
  uline(page, x, 283, y - 2);

  x = 288;
  x += txt(page, 'Email Address:', x, y, bold, 9) + 3;
  txt(page, data.parent1Email || '', x, y, reg, 9);
  uline(page, x, MR, y - 2);
  y -= 17;

  // Secondary Parent
  x = ML;
  x += txt(page, 'Name of Secondary Parent/Guardian', x, y, bold, 9) + 3;
  txt(page, data.parent2Name || '', x, y, reg, 9);
  uline(page, x, MR, y - 2);
  y -= 17;

  x = ML;
  x += txt(page, 'Cell Phone:', x, y, bold, 9) + 3;
  txt(page, data.parent2Phone || '', x, y, reg, 9);
  uline(page, x, 283, y - 2);

  x = 288;
  x += txt(page, 'Email Address:', x, y, bold, 9) + 3;
  txt(page, data.parent2Email || '', x, y, reg, 9);
  uline(page, x, MR, y - 2);
  y -= 13;

  txt(page, '* The Primary Parent/Guardian is responsible for payment of tuition and communication with the school.', ML, y, italic, 7.5, DGRAY);
  y -= 14;
  hline(page, ML, MR, y);
  y -= 15;

  // Enrollment Preferences
  center(page, 'Enrollment Preferences', y, bold, 12);
  y -= 18;

  txt(page, 'DAYS:', ML, y, bold, 9);
  txt(page, 'HOURS:', COL2, y, bold, 9);
  y -= 15;

  box(page, ML + 10, y, data.days === '2days');
  txt(page, '2 Days/Week (T & TH)', ML + 23, y + 1, reg, 9);
  box(page, COL2 + 10, y, data.hours === 'half');
  txt(page, '1/2 Day (8:30 AM - 12:30 PM)', COL2 + 23, y + 1, reg, 9);
  y -= 14;

  box(page, ML + 10, y, data.days === '3days');
  txt(page, '3 Days/Week (M, W & F)', ML + 23, y + 1, reg, 9);
  box(page, COL2 + 10, y, data.hours === 'threequarter');
  txt(page, '3/4 Day (8:30 AM - 3 PM)', COL2 + 23, y + 1, reg, 9);
  y -= 14;

  box(page, ML + 10, y, data.days === '5days');
  txt(page, '5 Days/Week (M - F)', ML + 23, y + 1, reg, 9);
  box(page, COL2 + 10, y, data.hours === 'full');
  txt(page, 'Full Day (8:30 AM - 5 PM)', COL2 + 23, y + 1, reg, 9);
  y -= 18;

  // Potty trained | Start date
  txt(page, 'My Child is Potty Trained:', ML, y, bold, 9);
  txt(page, 'Desired Start Date:*', COL2, y, boldItalic, 9);
  y -= 14;

  box(page, ML + 10, y, data.potty === 'yes');
  txt(page, 'Yes', ML + 23, y + 1, reg, 9);
  txt(page, '(MM/DD/YY):', COL2, y + 1, reg, 9);
  txt(page, formatDate(data.startDate) || '    /    /', COL2 + 68, y + 1, reg, 9);
  y -= 14;

  box(page, ML + 10, y, data.potty === 'no');
  txt(page, 'No', ML + 23, y + 1, reg, 9);
  y -= 16;

  const ageLabel = "Child's age on desired start date:";
  const ageLW = bold.widthOfTextAtSize(ageLabel, 9);
  txt(page, ageLabel, ML, y, bold, 9);
  txt(page, data.ageAtStart || '', ML + ageLW + 4, y, reg, 9);
  uline(page, ML + ageLW + 4, ML + ageLW + 90, y - 2);

  // Start date disclaimer (right side)
  const noteY = y + 2;
  drawWrapped(page, '* This form does NOT guarantee your requested start date or schedule. Schedules are based on availability at the time of receipt of the completed ENROLLMENT PACKET.', COL2, noteY, CW / 2 - 10, italic, 7, 9, DGRAY);

  y -= 14;
  hline(page, ML, MR, y);
  y -= 14;

  // Registration Fee
  center(page, 'Non-Refundable Registration Fee ($175)', y, bold, 12);
  y -= 18;

  box(page, ML + 10, y, data.paymentMethod === 'check');
  txt(page, 'Paid by check (attached)', ML + 23, y + 1, reg, 9);
  y -= 18;

  box(page, ML + 10, y, data.paymentMethod === 'zelle');
  if (data.paymentMethod === 'zelle') {
    txt(page, `Paid via Zelle on ${formatDate(data.zelleDate) || '___/___/___'}  from this name: ${data.zelleName || ''}`, ML + 23, y + 1, reg, 9);
  } else {
    txt(page, 'Paid via Zelle on ___/___/___  from this name: ___________________________', ML + 23, y + 1, reg, 9);
  }
  y -= 13;

  txt(page, 'Zelle payment must be processed before form is returned (Zelle payment address: scctuition123@gmail.com)', ML + 10, y, italic, 7.5, DGRAY);
}

// ── page 2 ───────────────────────────────────────────────────────────────────

function drawPage2(page, data, { reg, bold, italic, boldItalic }) {
  let y = 758;

  center(page, 'Registration Agreement Terms', y, bold, 14);
  y -= 16;
  center(page, 'Please initial', y, italic, 11);
  y -= 18;

  // Fundraiser commitment (added by web form, not on original paper)
  hline(page, ML, MR, y, 0.75, BLACK);
  y -= 12;
  center(page, 'Fundraiser Volunteer Commitment', y, bold, 10);
  y -= 12;

  const fundraiserLabels = {
    wheelie_fun_fest: 'Wheelie Fun Fest (1st Saturday of June)',
    silverado_country_fair: 'Silverado Country Fair (2nd weekend of October)',
    donation_in_lieu: 'Donation in lieu of volunteering ($250 to FoSCC)',
  };
  const fcLabel = 'Family commitment: ';
  const fcLW = bold.widthOfTextAtSize(fcLabel, 9);
  txt(page, fcLabel, ML, y, bold, 9);
  txt(page, fundraiserLabels[data.fundraiserChoice] || data.fundraiserChoice || 'Not specified', ML + fcLW, y, reg, 9);
  y -= 18;

  hline(page, ML, MR, y, 0.75, BLACK);
  y -= 16;

  // Policy items
  function policySection(title, bodyLines, agreedKey) {
    const agreed = !!data[agreedKey];
    uline(page, ML, ML + 38, y);
    if (agreed) txt(page, 'Agreed', ML + 2, y + 3, bold, 7, GREEN);

    txt(page, title, ML + 48, y, bold, 9);
    y -= 11;

    for (const line of bodyLines) {
      y = drawWrapped(page, line, ML + 58, y, CW - 62, reg, 7.5, 9.5);
    }
    y -= 7;
  }

  policySection('Non-Refundable Registration Fee:', [
    '$175 initial registration fee',
    '$100 Renewal fee annually',
  ], 'agree_fee');

  policySection('Tuition is:', [
    '• Due on the first day of enrollment (prorated for the first month) and the 1st of every month thereafter.',
    '• Accepted via Check (mailed or dropped off at the school) OR Zelle.',
    '• Equal installments. Tuition is a consistent amount each month regardless of the number of days attended. Tuition fees are not subject to proration for illness, absences, vacations, school closures, or holidays. No refunds or make-up days.',
    '• Considered late if not paid by the 5th of the month. A $50 late fee will be assessed. Accounts not paid by the 10th may result in suspension or termination and referral to a collection agency.',
  ], 'agree_tuition');

  policySection('Returned Check Policy:', [
    'A $50.00 fee will be assessed for all returned checks. Replacement payments must be made by cashier\'s check, money order, or Zelle. After two (2) NSF checks, all future payments must be cashier\'s check, money order, or Zelle.',
  ], 'agree_check');

  policySection('Absences:', [
    'Tuition amount remains the same, regardless of attendance. Credit is not given for absence due to school closures, illness, holiday, or personal situation. A child cannot switch to a different day of the week in order to make up for a missed day.',
  ], 'agree_absences');

  policySection('Schedule Changes:', [
    'SCC requires at least two weeks\' written notice prior to changing your child\'s schedule (days or hours). The new schedule and tuition rate will be effective on the 1st of the next month.',
  ], 'agree_schedule');

  policySection('Withdrawals:', [
    'SCC requires at least two weeks\' written notice prior to withdrawing your child from the program. No refunds will be given if less than two weeks\' written notice is given. Tuition must be paid in full for the final week.',
  ], 'agree_withdrawal');

  policySection('Termination of Agreement:', [
    'All children are accepted on a trial basis. If at any time the Director feels that Silverado Children\'s Center is not best suited for a child, the family may be asked to seek other arrangements. SCC reserves the right to terminate enrollment without notice for any of the following reasons:',
    '• Parent/Guardian is verbally or physically abusive to staff, children, or anyone on site.',
    '• Child exhibits excessive unacceptable, aggressive, or inappropriate behavior that may endanger others.',
    '• Non-payment of tuition.',
    '• Child is unable to adjust to Silverado Children\'s Center program.',
    '• Parent/Guardian is consistently or excessively late for pick-up or shows general disregard for school policies.',
  ], 'agree_termination');

  policySection('Family Discount:', [
    'Discount is taken off the lowest monthly rate: 10% off 2nd child, 15% off 3rd child, 20% off 4th child.',
  ], 'agree_discount');

  policySection('Department of Licensing:', [
    'The Department of Licensing shall have the authority to interview children or staff, and to inspect and audit child or facility records without prior permission, and to observe the physical condition of a child.',
  ], 'agree_licensing');

  // Consent paragraph
  hline(page, ML, MR, y, 0.5);
  y -= 12;

  const consent = 'As a condition to enrollment of my child, I consent to and will comply with this Registration Agreement together with the policies and procedures outlined in the Family Handbook (provided with the enrollment packet). I understand that the policies contained in this Agreement and the Family Handbook will remain in effect until notified otherwise by the Director of Silverado Children\'s Center.';
  y = drawWrapped(page, consent, ML, y, CW, reg, 8, 10.5);
  y -= 14;

  // Signature
  const sigLabel = 'Parent/Guardian Signature:';
  const sigLW = reg.widthOfTextAtSize(sigLabel, 9);
  txt(page, sigLabel, ML, y, reg, 9);
  txt(page, data.sigName || '', ML + sigLW + 4, y, bold, 9);
  uline(page, ML + sigLW + 4, 420, y - 2);

  const dateLabel = 'Date';
  txt(page, dateLabel, 430, y, reg, 9);
  const dateLW = reg.widthOfTextAtSize(dateLabel, 9);
  txt(page, formatDate(data.sigDate) || '', 430 + dateLW + 6, y, bold, 9);
  uline(page, 430 + dateLW + 6, MR, y - 2);

  y -= 10;
  txt(page, 'Submitted electronically via silveradochildrenscenter.com', ML, y, italic, 7, MGRAY);
}

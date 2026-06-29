const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const spamPatterns = [
  /buy now|click here|limited time|act now|free money|earn money fast|make money online/i,
  /casino|gambling|betting|cryptocurrency.*guaranteed|get rich/i,
  /viagra|cialis|weight loss.*fast/i,
  /https?:\/\/[^\s]+(?:click|track|affiliate|ref)/i,
  /(.)\1{5,}/,  // repeated characters
];

const bannedWords = [
  'scam', 'fraud', 'hack', 'crack', 'illegal', 'drug', 'weapon', 'porn',
  'nude', 'sex', 'violence', 'terror', 'bomb', 'kill', 'suicide',
];

function checkSpam(text = '') {
  const results = [];
  const lower = text.toLowerCase();

  for (const pattern of spamPatterns) {
    if (pattern.test(text)) {
      results.push({ type: 'spam_pattern', match: pattern.source });
      break;
    }
  }

  for (const word of bannedWords) {
    if (lower.includes(word)) {
      results.push({ type: 'banned_word', match: word });
    }
  }

  if (text.length > 5000) {
    results.push({ type: 'too_long', match: `${text.length} chars` });
  }

  if (text.split('\n').length > 50) {
    results.push({ type: 'excessive_lines', match: `${text.split('\n').length} lines` });
  }

  return results;
}

async function moderateProduct(productId) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return [];

  const issues = [];

  // Check name
  const nameIssues = checkSpam(product.name);
  issues.push(...nameIssues.map(i => ({ ...i, field: 'name' })));

  // Check description
  if (product.description) {
    const descIssues = checkSpam(product.description);
    issues.push(...descIssues.map(i => ({ ...i, field: 'description' })));
  }

  // Check price
  if (product.price <= 0) {
    issues.push({ type: 'invalid_price', field: 'price', match: `${product.price}` });
  }

  // Flag if issues found
  if (issues.length > 0) {
    await prisma.product.update({
      where: { id: productId },
      data: { isApproved: false },
    });

    await prisma.fraudAlert.create({
      data: {
        userId: product.vendorId,
        type: 'SPAM_PRODUCT',
        details: `Product "${product.name}" flagged: ${issues.map(i => i.type).join(', ')}`,
        risk: issues.length > 3 ? 'high' : 'medium',
        status: 'FLAGGED',
      },
    });
  }

  return issues;
}

async function moderateReview(reviewId) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { product: true },
  });
  if (!review) return [];

  const issues = checkSpam(review.comment || review.title || '');

  if (issues.length > 0) {
    await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: false },
    });
  }

  return issues;
}

module.exports = { checkSpam, moderateProduct, moderateReview };

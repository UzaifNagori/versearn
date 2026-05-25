export const mockUser = {
  id: '1',
  username: 'ahmed_pk',
  email: 'ahmed@example.com',
  verse_balance: 2450,
  total_earned: 8920,
  referral_code: 'AHMED50',
  referred_by: null,
  wallet_address: '',
  is_premium: false,
  total_referrals: 12,
  created_at: '2024-01-15T10:00:00Z',
};

export const mockTransactions = [
  { id: '1', type: 'earn_ad', amount: 1, description: 'Ad watch reward', status: 'completed', created_at: '2025-01-20T14:30:00Z' },
  { id: '2', type: 'earn_survey', amount: 25, description: 'Survey completed: Tech Products', status: 'completed', created_at: '2025-01-20T13:00:00Z' },
  { id: '3', type: 'earn_checkin', amount: 5, description: 'Daily check-in bonus', status: 'completed', created_at: '2025-01-20T09:00:00Z' },
  { id: '4', type: 'withdrawal', amount: -1000, description: 'EasyPaisa withdrawal', status: 'approved', created_at: '2025-01-19T16:00:00Z' },
  { id: '5', type: 'earn_referral', amount: 50, description: 'Referral bonus: zara_pk joined', status: 'completed', created_at: '2025-01-19T11:00:00Z' },
  { id: '6', type: 'earn_ad', amount: 1, description: 'Ad watch reward', status: 'completed', created_at: '2025-01-19T10:30:00Z' },
  { id: '7', type: 'nft_sale', amount: 500, description: 'NFT sold: Cosmic Dragon #1', status: 'completed', created_at: '2025-01-18T15:00:00Z' },
  { id: '8', type: 'nft_purchase', amount: -300, description: 'NFT purchased: Neon Tiger', status: 'completed', created_at: '2025-01-18T12:00:00Z' },
  { id: '9', type: 'earn_walk', amount: 30, description: 'Walk to earn: 3000 steps', status: 'completed', created_at: '2025-01-18T08:00:00Z' },
  { id: '10', type: 'earn_survey', amount: 50, description: 'Survey completed: Finance', status: 'completed', created_at: '2025-01-17T14:00:00Z' },
  { id: '11', type: 'withdrawal', amount: -2000, description: 'JazzCash withdrawal', status: 'pending', created_at: '2025-01-17T10:00:00Z' },
  { id: '12', type: 'earn_ad', amount: 1, description: 'Ad watch reward', status: 'completed', created_at: '2025-01-17T09:00:00Z' },
  { id: '13', type: 'nft_mint', amount: -10, description: 'NFT minted: Pixel Warrior', status: 'completed', created_at: '2025-01-16T16:00:00Z' },
  { id: '14', type: 'earn_referral', amount: 50, description: 'Referral bonus: ali_786 joined', status: 'completed', created_at: '2025-01-16T11:00:00Z' },
  { id: '15', type: 'earn_checkin', amount: 5, description: 'Daily check-in bonus', status: 'completed', created_at: '2025-01-15T09:00:00Z' },
];

export const mockNFTs = [
  { id: '1', title: 'Cosmic Dragon #1', description: 'A majestic dragon from the cosmos', image_url: 'https://picsum.photos/400/400?random=1', is_listed: true, list_price: 500, is_minted: true, owner_id: '1', created_at: '2025-01-10T10:00:00Z' },
  { id: '2', title: 'Neon Tiger', description: 'A glowing neon tiger in the digital jungle', image_url: 'https://picsum.photos/400/400?random=2', is_listed: false, list_price: null, is_minted: true, owner_id: '1', created_at: '2025-01-12T10:00:00Z' },
  { id: '3', title: 'Pixel Warrior', description: 'An 8-bit warrior ready for battle', image_url: 'https://picsum.photos/400/400?random=3', is_listed: true, list_price: 250, is_minted: true, owner_id: '1', created_at: '2025-01-14T10:00:00Z' },
  { id: '4', title: 'Abstract Sunset', description: 'Beautiful abstract sunset over mountains', image_url: 'https://picsum.photos/400/400?random=4', is_listed: false, list_price: null, is_minted: true, owner_id: '1', created_at: '2025-01-15T10:00:00Z' },
  { id: '5', title: 'Cyber Phoenix', description: 'A phoenix reborn in the digital age', image_url: 'https://picsum.photos/400/400?random=5', is_listed: true, list_price: 750, is_minted: true, owner_id: '1', created_at: '2025-01-16T10:00:00Z' },
  { id: '6', title: 'Golden Lotus', description: 'A golden lotus blooming in digital water', image_url: 'https://picsum.photos/400/400?random=6', is_listed: false, list_price: null, is_minted: true, owner_id: '1', created_at: '2025-01-17T10:00:00Z' },
];

export const mockListings = [
  { id: 'l1', nft: { id: '1', title: 'Cosmic Dragon #1', image_url: 'https://picsum.photos/400/400?random=1' }, seller: { username: 'ahmed_pk' }, price: 500, created_at: '2025-01-10T10:00:00Z' },
  { id: 'l2', nft: { id: '3', title: 'Pixel Warrior', image_url: 'https://picsum.photos/400/400?random=3' }, seller: { username: 'ahmed_pk' }, price: 250, created_at: '2025-01-14T10:00:00Z' },
  { id: 'l3', nft: { id: '5', title: 'Cyber Phoenix', image_url: 'https://picsum.photos/400/400?random=5' }, seller: { username: 'ahmed_pk' }, price: 750, created_at: '2025-01-16T10:00:00Z' },
  { id: 'l4', nft: { id: '7', title: 'Desert Storm', image_url: 'https://picsum.photos/400/400?random=7' }, seller: { username: 'zara_pk' }, price: 400, created_at: '2025-01-11T10:00:00Z' },
  { id: 'l5', nft: { id: '8', title: 'Mountain Spirit', image_url: 'https://picsum.photos/400/400?random=8' }, seller: { username: 'ali_786' }, price: 600, created_at: '2025-01-13T10:00:00Z' },
  { id: 'l6', nft: { id: '9', title: 'Ocean Depths', image_url: 'https://picsum.photos/400/400?random=9' }, seller: { username: 'sara_k' }, price: 350, created_at: '2025-01-15T10:00:00Z' },
  { id: 'l7', nft: { id: '10', title: 'Fire Serpent', image_url: 'https://picsum.photos/400/400?random=10' }, seller: { username: 'hassan_m' }, price: 900, created_at: '2025-01-17T10:00:00Z' },
  { id: 'l8', nft: { id: '11', title: 'Crystal Cave', image_url: 'https://picsum.photos/400/400?random=11' }, seller: { username: 'fatima_r' }, price: 200, created_at: '2025-01-18T10:00:00Z' },
];

export const mockWithdrawals = [
  { id: 'w1', method: 'EasyPaisa', amount: 1000, usd_value: 1.0, account: '03001234567', status: 'approved', created_at: '2025-01-19T16:00:00Z', note: '' },
  { id: 'w2', method: 'JazzCash', amount: 2000, usd_value: 2.0, account: '03111234567', status: 'pending', created_at: '2025-01-17T10:00:00Z', note: '' },
  { id: 'w3', method: 'USDT', amount: 5000, usd_value: 5.0, account: '0xABC123...', status: 'rejected', created_at: '2025-01-10T10:00:00Z', note: 'Wallet address invalid' },
];

export const mockReferrals = [
  { id: 'r1', username: 'zara_pk', email: 'zara@example.com', joined_at: '2025-01-19T11:00:00Z', verse_earned: 50 },
  { id: 'r2', username: 'ali_786', email: 'ali@example.com', joined_at: '2025-01-16T11:00:00Z', verse_earned: 50 },
  { id: 'r3', username: 'sara_k', email: 'sara@example.com', joined_at: '2025-01-14T09:00:00Z', verse_earned: 50 },
  { id: 'r4', username: 'hassan_m', email: 'hassan@example.com', joined_at: '2025-01-12T14:00:00Z', verse_earned: 50 },
  { id: 'r5', username: 'fatima_r', email: 'fatima@example.com', joined_at: '2025-01-10T10:00:00Z', verse_earned: 50 },
];

export const mockDailyStats = {
  ads_earned: 23,
  survey_earned: 50,
  walk_earned: 30,
  checkin_done: true,
  ads_limit: 50,
  survey_limit: 200,
  walk_limit: 100,
  streak: 5,
};

export const mockAdminStats = {
  total_users: 1247,
  total_verse_circulation: 2840000,
  daily_active: 89,
  pending_withdrawals: 7,
};

export const mockAdminUsers = [
  { id: '1', username: 'ahmed_pk', email: 'ahmed@example.com', verse_balance: 2450, total_earned: 8920, joined_at: '2024-01-15T10:00:00Z', status: 'active' },
  { id: '2', username: 'zara_pk', email: 'zara@example.com', verse_balance: 1200, total_earned: 3400, joined_at: '2025-01-19T11:00:00Z', status: 'active' },
  { id: '3', username: 'ali_786', email: 'ali@example.com', verse_balance: 800, total_earned: 2100, joined_at: '2025-01-16T11:00:00Z', status: 'active' },
  { id: '4', username: 'sara_k', email: 'sara@example.com', verse_balance: 3200, total_earned: 9800, joined_at: '2025-01-14T09:00:00Z', status: 'active' },
  { id: '5', username: 'hassan_m', email: 'hassan@example.com', verse_balance: 150, total_earned: 500, joined_at: '2025-01-12T14:00:00Z', status: 'banned' },
];

export const mockAdminWithdrawals = [
  { id: 'w1', user: { username: 'ahmed_pk' }, method: 'EasyPaisa', amount: 1000, usd_value: 1.0, created_at: '2025-01-19T16:00:00Z', status: 'approved', note: '' },
  { id: 'w2', user: { username: 'zara_pk' }, method: 'JazzCash', amount: 2000, usd_value: 2.0, created_at: '2025-01-17T10:00:00Z', status: 'pending', note: '' },
  { id: 'w3', user: { username: 'ali_786' }, method: 'USDT', amount: 5000, usd_value: 5.0, created_at: '2025-01-10T10:00:00Z', status: 'rejected', note: 'Wallet address invalid' },
  { id: 'w4', user: { username: 'sara_k' }, method: 'EasyPaisa', amount: 1500, usd_value: 1.5, created_at: '2025-01-20T09:00:00Z', status: 'pending', note: '' },
  { id: 'w5', user: { username: 'hassan_m' }, method: 'JazzCash', amount: 1000, usd_value: 1.0, created_at: '2025-01-20T11:00:00Z', status: 'pending', note: '' },
];

export const mockDailyNewUsers = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 19 },
  { day: 'Wed', count: 8 },
  { day: 'Thu', count: 25 },
  { day: 'Fri', count: 31 },
  { day: 'Sat', count: 22 },
  { day: 'Sun', count: 17 },
];

export const mockSurveys = [
  { id: 's1', title: 'Tech Products Usage Survey', reward: 25, estimated_minutes: 5, category: 'Technology' },
  { id: 's2', title: 'Online Shopping Habits', reward: 50, estimated_minutes: 10, category: 'E-Commerce' },
  { id: 's3', title: 'Mobile App Preferences', reward: 10, estimated_minutes: 3, category: 'Mobile' },
];

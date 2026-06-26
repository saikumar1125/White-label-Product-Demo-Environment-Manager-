import assert from 'assert';

const API_BASE = 'http://localhost:3001/api';

async function runTests() {
  console.log('🚀 Starting API validation tests...\n');

  let token = '';
  let testEnvId = 'TEST-ENV-999';

  // 1. Test failed login
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@brandsparkx.com', password: 'wrongpassword' })
    });
    assert.strictEqual(res.status, 401, 'Failed login should return 401');
    const data = await res.json();
    assert.strictEqual(data.success, false, 'Failed login response success should be false');
    console.log('✅ Test 1 Passed: Failed login correctly blocked.');
  } catch (err) {
    console.error('❌ Test 1 Failed:', err.message);
    process.exit(1);
  }

  // 2. Test successful login
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@brandsparkx.com', password: 'Sparkx2026!' })
    });
    assert.strictEqual(res.status, 200, 'Successful login should return 200');
    const data = await res.json();
    assert.strictEqual(data.success, true, 'Successful login success should be true');
    assert.ok(data.token, 'Response should contain token');
    token = data.token;
    console.log('✅ Test 2 Passed: Successful login completed.');
  } catch (err) {
    console.error('❌ Test 2 Failed:', err.message);
    process.exit(1);
  }

  // 3. Test auth session validation (/auth/me)
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200, 'Session validation should return 200');
    const data = await res.json();
    assert.strictEqual(data.email, 'admin@brandsparkx.com', 'Should return authenticated user profile details');
    console.log('✅ Test 3 Passed: Session validation profile matches.');
  } catch (err) {
    console.error('❌ Test 3 Failed:', err.message);
    process.exit(1);
  }

  // 4. Test fetch dashboard summary
  try {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    assert.strictEqual(res.status, 200, 'Dashboard summary query should return 200');
    const data = await res.json();
    assert.ok(data.totalDemos, 'Summary should contain totalDemos');
    assert.ok(data.activeDemos, 'Summary should contain activeDemos');
    console.log(`✅ Test 4 Passed: Dashboard summary fetched successfully (Total Demos: ${data.totalDemos}).`);
  } catch (err) {
    console.error('❌ Test 4 Failed:', err.message);
    process.exit(1);
  }

  // 5. Test create environment (POST)
  try {
    const newDemo = {
      id: testEnvId,
      clientName: 'Acme Test Corp',
      productType: 'hrms',
      productLabel: 'Test HRMS Module',
      status: 'Provisioning',
      expiresAt: 'Dec 31, 2026',
      lastActivity: 'Provisioning Started',
      adminEmail: 'acme@test.com',
      dataPreset: 'retail',
      sessionRecording: true,
      analyticsTracking: false,
      avatarInitials: 'AT',
      avatarBg: 'bg-green-100',
      avatarText: 'text-green-600'
    };

    const res = await fetch(`${API_BASE}/environments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDemo)
    });
    assert.ok(res.status === 200 || res.status === 201 || res.status === 211, 'Create should return 200/201/211 status');
    const data = await res.json();
    assert.strictEqual(data.id, testEnvId, 'Returned environment ID should match');
    assert.strictEqual(data.clientName, 'Acme Test Corp', 'Returned client name should match');
    console.log('✅ Test 5 Passed: Environment created successfully.');
  } catch (err) {
    console.error('❌ Test 5 Failed:', err.message);
    process.exit(1);
  }

  // 6. Test fetch single environment details (GET)
  try {
    const res = await fetch(`${API_BASE}/environments/${testEnvId}`);
    assert.strictEqual(res.status, 200, 'GET details should return 200');
    const data = await res.json();
    assert.strictEqual(data.clientName, 'Acme Test Corp', 'GET details should return correct clientName');
    console.log('✅ Test 6 Passed: Environment details queried successfully.');
  } catch (err) {
    console.error('❌ Test 6 Failed:', err.message);
    process.exit(1);
  }

  // 7. Test update environment (PATCH)
  try {
    const updatePayload = {
      expiresAt: 'Jan 1, 2027',
      lastActivity: 'License Extended'
    };

    const res = await fetch(`${API_BASE}/environments/${testEnvId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    assert.strictEqual(res.status, 200, 'PATCH update should return 200');
    const data = await res.json();
    assert.strictEqual(data.expiresAt, 'Jan 1, 2027', 'Updated expiresAt should match');
    console.log('✅ Test 7 Passed: Environment updated successfully.');
  } catch (err) {
    console.error('❌ Test 7 Failed:', err.message);
    process.exit(1);
  }

  // 8. Test delete environment (DELETE)
  try {
    const res = await fetch(`${API_BASE}/environments/${testEnvId}`, {
      method: 'DELETE'
    });
    assert.strictEqual(res.status, 200, 'DELETE should return 200');
    const data = await res.json();
    assert.strictEqual(data.success, true, 'DELETE success response should be true');
    console.log('✅ Test 8 Passed: Environment terminated successfully.');
  } catch (err) {
    console.error('❌ Test 8 Failed:', err.message);
    process.exit(1);
  }

  // 9. Test fetch logs
  try {
    const res = await fetch(`${API_BASE}/logs`);
    assert.strictEqual(res.status, 200, 'GET logs should return 200');
    const logs = await res.json();
    assert.ok(Array.isArray(logs), 'Response should be an array of logs');
    assert.ok(logs.length > 0, 'Logs array should not be empty');
    console.log(`✅ Test 9 Passed: Audit logs retrieved (${logs.length} entries).`);
  } catch (err) {
    console.error('❌ Test 9 Failed:', err.message);
    process.exit(1);
  }

  console.log('\n⭐ All API tests passed successfully! Functional verification complete. ⭐');
}

runTests();

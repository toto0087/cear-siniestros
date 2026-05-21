#!/usr/bin/env node

async function test() {
  console.log('Starting test...');
  const url = 'https://ldqnqaywpfzokwpxapgw.supabase.co/rest/v1/usuarios?select=*&limit=1';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcW5xYXl3cGZ6b2t3cHhhcGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDYwMDMsImV4cCI6MjA5NDgyMjAwM30.Zt9unYqnu19DFveztA-6yyrpz772XE-BZpRTRKVufc0';
  
  try {
    console.log('Making fetch request to:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});

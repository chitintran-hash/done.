import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const districtCode = searchParams.get('districtCode');

  if (!districtCode) {
    return NextResponse.json({ wards: [] });
  }

  try {
    const res = await fetch(`https://provinces.open-api.vn/api/v1/d/${districtCode}?depth=2`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 86400 } // Cache for 24h
    });

    if (!res.ok) {
      throw new Error(`Failed with status ${res.status}`);
    }

    const data = await res.json();
    const wards = Array.isArray(data.wards)
      ? data.wards.map((w: any) => ({
          code: w.code,
          name: w.name,
          division_type: w.division_type,
        }))
      : [];

    return NextResponse.json({ wards });
  } catch (error) {
    console.error('Error fetching wards:', error);
    return NextResponse.json({ wards: [] });
  }
}

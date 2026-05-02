// Public-safe member roster. Sourced from join submissions with PII stripped:
// no emails, phone numbers, LinkedIn or expectations. First names only.

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Member {
  firstName: string
  district: string
  skill: SkillLevel
}

export const MEMBERS: Member[] = [
  { firstName: 'Aswin', district: 'Thiruvananthapuram', skill: 'intermediate' },
  { firstName: 'Sreyas', district: 'Alappuzha', skill: 'intermediate' },
  { firstName: 'Goutham', district: 'Pathanamthitta', skill: 'intermediate' },
  { firstName: 'Roopasree', district: 'Idukki', skill: 'beginner' },
  { firstName: 'Yasir', district: 'Kasaragod', skill: 'intermediate' },
  { firstName: 'Abhijith', district: 'Thiruvananthapuram', skill: 'intermediate' },
  { firstName: 'Viraj', district: 'Ernakulam', skill: 'advanced' },
  { firstName: 'Aswin', district: 'Thrissur', skill: 'intermediate' },
  { firstName: 'Jazil', district: 'Palakkad', skill: 'intermediate' },
  { firstName: 'Mohammad', district: 'Kozhikode', skill: 'intermediate' },
  { firstName: 'Nayana', district: 'Palakkad', skill: 'intermediate' },
  { firstName: 'Mohamed', district: 'Malappuram', skill: 'intermediate' },
  { firstName: 'Vishnu', district: 'Palakkad', skill: 'advanced' },
  { firstName: 'Mishal', district: 'Palakkad', skill: 'intermediate' },
  { firstName: 'Fayis', district: 'Kozhikode', skill: 'intermediate' },
  { firstName: 'Anaswara', district: 'Thrissur', skill: 'advanced' },
  { firstName: 'George', district: 'Pathanamthitta', skill: 'beginner' },
  { firstName: 'Jithu', district: 'Pathanamthitta', skill: 'intermediate' },
  { firstName: 'Abhiram', district: 'Palakkad', skill: 'intermediate' },
  { firstName: 'Chaitanya', district: 'Palakkad', skill: 'intermediate' },
  { firstName: 'Aakash', district: 'Thrissur', skill: 'advanced' },
  { firstName: 'Aamina', district: 'Thiruvananthapuram', skill: 'beginner' },
  { firstName: 'Aqeel', district: 'Thrissur', skill: 'intermediate' },
  { firstName: 'Dhanush', district: 'Ernakulam', skill: 'intermediate' },
  { firstName: 'Aparna', district: 'Alappuzha', skill: 'intermediate' },
  { firstName: 'Adnan', district: 'Malappuram', skill: 'intermediate' },
  { firstName: 'Aflah', district: 'Malappuram', skill: 'beginner' },
  { firstName: 'Mazahir', district: 'Kannur', skill: 'intermediate' },
  { firstName: 'Rishikesh', district: 'Kannur', skill: 'intermediate' },
  { firstName: 'Nithin', district: 'Kollam', skill: 'intermediate' }
]

// Approximate district centers (lat, lng). Kerala bounding box: lat 8.18..12.78, lng 74.86..77.40
export const DISTRICT_COORDS: Record<string, { lat: number, lng: number }> = {
  Kasaragod: { lat: 12.50, lng: 74.99 },
  Kannur: { lat: 11.87, lng: 75.37 },
  Wayanad: { lat: 11.69, lng: 76.13 },
  Kozhikode: { lat: 11.25, lng: 75.78 },
  Malappuram: { lat: 11.07, lng: 76.08 },
  Palakkad: { lat: 10.79, lng: 76.65 },
  Thrissur: { lat: 10.52, lng: 76.21 },
  Ernakulam: { lat: 10.00, lng: 76.30 },
  Idukki: { lat: 9.85, lng: 77.10 },
  Kottayam: { lat: 9.59, lng: 76.52 },
  Alappuzha: { lat: 9.49, lng: 76.33 },
  Pathanamthitta: { lat: 9.26, lng: 76.78 },
  Kollam: { lat: 8.89, lng: 76.59 },
  Thiruvananthapuram: { lat: 8.52, lng: 76.94 }
}

export class HospitalAgent {
  async run({ symptoms, location }: { symptoms: any; location?: any }) {
    // Minimal demo: return a static nearby hospital list; in prod query real dataset or maps API
    return [{ id: 'h1', name: 'Sehat General Hospital', address: '1 Health St', latitude: 28.6139, longitude: 77.2090, emergency: true }];
  }
}

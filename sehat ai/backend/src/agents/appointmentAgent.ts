export class AppointmentAgent {
  async run({ hospitals, consultationId }: any) {
    // Demo: create a suggested appointment object
    const appointment = { id: `apt-${Date.now()}`, consultationId, hospitalId: hospitals[0]?.id || null, scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24) };
    return appointment;
  }
}

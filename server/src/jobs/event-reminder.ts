import { Event, Notification } from '../models/index.js';
import { sendEmail } from '../utils/email.js';
import { eventReminderEmail } from '../utils/email-templates.js';

export async function processEventReminders(): Promise<void> {
  const now = new Date();

  // Check for events in next 30 days that have reminders enabled
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const events = await Event.find({
    'reminderSettings.enabled': true,
    date: { $gte: now, $lte: thirtyDaysFromNow },
  })
    .populate('userId', 'name email')
    .populate('relationshipId', 'name');

  for (const event of events) {
    const eventDate = new Date(event.date);
    const daysUntil = Math.ceil(
      (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Check if daysUntil matches any reminder daysBefore setting
    const daysBefore = event.reminderSettings.daysBefore;
    if (!daysBefore.includes(daysUntil)) continue;

    const user = event.userId as unknown as {
      _id: string;
      name: string;
      email: string;
    };
    const relationship = event.relationshipId as unknown as {
      name: string;
    } | null;

    // Deduplication: eventId identifies the event; actionUrl encodes daysUntil
    // (Notification.data schema uses eventId + actionUrl — no daysUntil field)
    const dedupeKey = `event-reminder:${daysUntil}`;
    const existingNotification = await Notification.findOne({
      userId: user._id,
      type: 'event_reminder',
      'data.eventId': event._id,
      'data.actionUrl': dedupeKey,
    });
    if (existingNotification) continue;

    // Always include in_app; add any other configured channels from event settings
    const eventChannels = event.reminderSettings.channels;
    const notificationChannels: ('push' | 'email' | 'sms' | 'in_app')[] = [
      'in_app',
      ...eventChannels,
    ];

    // Create in-app notification
    await Notification.create({
      userId: user._id,
      type: 'event_reminder',
      title: `Nhắc nhở: ${event.title}`,
      message:
        daysUntil === 1
          ? `Sự kiện "${event.title}" sẽ diễn ra vào ngày mai!`
          : `Còn ${daysUntil} ngày đến sự kiện "${event.title}"`,
      data: {
        eventId: event._id,
        actionUrl: dedupeKey,
      },
      channels: notificationChannels,
    });

    // Send email if email channel is configured and user has an email address
    if (eventChannels.includes('email') && user.email) {
      // eventReminderEmail takes a Date — not a formatted string
      const html = eventReminderEmail(
        user.name,
        event.title,
        eventDate,
        daysUntil,
        relationship?.name ?? '',
      );
      sendEmail({
        to: user.email,
        subject: `Nhắc nhở: ${event.title} - còn ${daysUntil} ngày`,
        html,
      }).catch(() => {}); // Fire and forget
    }
  }

  console.log(`[CRON] Event reminders processed at ${now.toISOString()}`);
}


import { BookingDetails } from "@/types";
import { CONTACT_INFO } from "@/constants";

const API_URL = "/api/send-email";

/**
 * Sendet eine Buchungsbestätigung an den Inhaber.
 */
export const sendBookingEmailToOwner = async (booking: BookingDetails, distance: number | null): Promise<boolean> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: [CONTACT_INFO.email, "AS.TAXI.CODING@gmail.com"],
        subject: `NEUE BUCHUNG: ${booking.name} am ${booking.date}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #ea8e24;">Neue Buchung eingegangen</h2>
            <p><strong>Kunde:</strong> ${booking.name}</p>
            <p><strong>Telefon:</strong> ${booking.phone}</p>
            <p><strong>E-Mail:</strong> ${booking.email || 'Nicht angegeben'}</p>
            <hr />
            <p><strong>Abholung:</strong> ${booking.pickup}</p>
            <p><strong>Ziel:</strong> ${booking.destination}</p>
            <p><strong>Datum/Zeit:</strong> ${booking.date} um ${booking.time} Uhr</p>
            <p><strong>Fahrzeug:</strong> ${booking.vehicleType}</p>
            <p><strong>Personen:</strong> ${booking.passengers}</p>
            <p><strong>Preis:</strong> ca. ${booking.price.toFixed(2)} €</p>
            <p><strong>Distanz:</strong> ${distance?.toFixed(1) || '---'} km</p>
            <p><strong>Notizen:</strong> ${booking.notes || 'Keine'}</p>
          </div>
        `
      })
    });

    const data = await response.json();
    if (!data.success) {
      console.error("Email API Error (Owner):", data);
    }
    return data.success;
  } catch (error) {
    console.error("Fehler beim Senden der E-Mail an Inhaber:", error);
    return false;
  }
};

/**
 * Sendet eine Buchungsbestätigung an den Kunden.
 */
export const sendBookingEmailToCustomer = async (booking: BookingDetails): Promise<boolean> => {
  if (!booking.email) return true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: booking.email,
        bcc: "AS.TAXI.CODING@gmail.com",
        subject: `Ihre Buchungsbestätigung - AS Taxi Service`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #000;">Vielen Dank für Ihre Buchung!</h2>
            <p>Hallo ${booking.name},</p>
            <p>wir haben Ihre Buchung erhalten und freuen uns darauf, Sie zu befördern.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Datum:</strong> ${booking.date}</p>
              <p><strong>Zeit:</strong> ${booking.time} Uhr</p>
              <p><strong>Abholung:</strong> ${booking.pickup}</p>
              <p><strong>Ziel:</strong> ${booking.destination}</p>
              <p><strong>Voraussichtlicher Preis:</strong> ca. ${booking.price.toFixed(2)} €</p>
            </div>
            <p>Sollten Sie Fragen haben, erreichen Sie uns unter ${CONTACT_INFO.phone}.</p>
            <p>Gute Fahrt wünscht Ihr AS Taxi Team!</p>
          </div>
        `
      })
    });

    const data = await response.json();
    if (!data.success) {
      console.error("Email API Error (Customer):", data);
    }
    return data.success;
  } catch (error) {
    console.error("Fehler beim Senden der E-Mail an Kunden:", error);
    return false;
  }
};

/**
 * Sendet eine Stornierungsbestätigung an den Kunden.
 */
export const sendCancellationEmailToCustomer = async (
  email: string, 
  name: string, 
  date: string, 
  time: string, 
  reason: string
): Promise<boolean> => {
  if (!email) return true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        bcc: "AS.TAXI.CODING@gmail.com",
        subject: `WICHTIG: Ihre Fahrt am ${date} wurde storniert`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #ff4444;">Fahrt storniert</h2>
            <p>Hallo ${name},</p>
            <p>leider müssen wir Ihnen mitteilen, dass Ihre geplante Fahrt am <strong>${date} um ${time} Uhr</strong> storniert wurde.</p>
            <p><strong>Grund:</strong> ${reason}</p>
            <p>Wir bitten vielmals um Entschuldigung für die Unannehmlichkeiten.</p>
            <p>Ihr AS Taxi Team</p>
          </div>
        `
      })
    });

    const data = await response.json();
    if (!data.success) {
      console.error("Email API Error (Customer Cancellation):", data);
    }
    return data.success;
  } catch (error) {
    console.error("Fehler beim Senden der Stornierungs-E-Mail an Kunden:", error);
    return false;
  }
};

/**
 * Sendet eine Stornierungsbenachrichtigung an den Inhaber.
 */
export const sendCancellationEmailToOwner = async (
  booking: any,
  reason: string
): Promise<boolean> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: [CONTACT_INFO.email, "AS.TAXI.CODING@gmail.com"],
        subject: `STORNIERUNG: Fahrt von ${booking.name} am ${booking.date}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #ff4444;">Fahrt wurde storniert</h2>
            <p><strong>Kunde:</strong> ${booking.name}</p>
            <p><strong>Datum/Zeit:</strong> ${booking.date} um ${booking.time} Uhr</p>
            <p><strong>Grund für Stornierung:</strong> ${reason}</p>
            <hr />
            <p>Die Verfügbarkeit wurde automatisch wieder freigegeben.</p>
          </div>
        `
      })
    });

    const data = await response.json();
    if (!data.success) {
      console.error("Email API Error (Owner Cancellation):", data);
    }
    return data.success;
  } catch (error) {
    console.error("Fehler beim Senden der Stornierungs-E-Mail an Inhaber:", error);
    return false;
  }
};

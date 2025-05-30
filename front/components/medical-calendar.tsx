"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, MapPin, Plus } from "lucide-react";

interface Appointment {
  id: string;
  doctor: string;
  doctorSpecialty?: string;
  date: Date;
  time: string;
  type: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  notes?: string;
}

interface MedicalCalendarProps {
  onClose: () => void;
  appointments: Appointment[];
}

export function MedicalCalendar({
  onClose,
  appointments,
}: MedicalCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");

  // Filter appointments for the selected date
  const selectedDateAppointments = appointments.filter((apt) => {
    if (!date) return false;
    const aptDate = new Date(apt.date);
    return (
      aptDate.getDate() === date.getDate() &&
      aptDate.getMonth() === date.getMonth() &&
      aptDate.getFullYear() === date.getFullYear()
    );
  });

  // Get dates that have appointments
  const appointmentDates = appointments.map((apt) => {
    const date = new Date(apt.date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });

  // Function to check if a date has appointments
  const hasAppointment = (day: Date) => {
    return appointmentDates.some(
      (aptDate) =>
        aptDate.getDate() === day.getDate() &&
        aptDate.getMonth() === day.getMonth() &&
        aptDate.getFullYear() === day.getFullYear()
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl border border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Medical Appointments</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid w-[300px] grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant={view === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("calendar")}
                className={
                  view === "calendar"
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                    : "border-primary/20"
                }
              >
                <CalendarDays className="h-4 w-4 mr-1" />
                Calendar
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("list")}
                className={
                  view === "list"
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                    : "border-primary/20"
                }
              >
                <ul className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>

          <TabsContent value="upcoming" className="mt-0">
            {view === "calendar" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-primary/10 bg-background/60 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md"
                      modifiers={{
                        hasAppointment: appointmentDates,
                      }}
                      modifiersStyles={{
                        hasAppointment: {
                          backgroundColor: "rgba(124, 58, 237, 0.1)",
                          fontWeight: "bold",
                          borderRadius: "0.25rem",
                        },
                      }}
                    />
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">
                    {date ? (
                      <>
                        Appointments for{" "}
                        {date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </>
                    ) : (
                      <>Select a date</>
                    )}
                  </h3>

                  {selectedDateAppointments.length > 0 ? (
                    selectedDateAppointments.map((apt) => (
                      <AppointmentCard key={apt.id} appointment={apt} />
                    ))
                  ) : (
                    <Card className="border border-dashed border-primary/20 bg-background/40">
                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground text-center">
                          No appointments scheduled for this date
                        </p>
                        <Button className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule Appointment
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments
                  .filter((apt) => apt.status === "upcoming")
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((apt) => (
                    <AppointmentCard key={apt.id} appointment={apt} />
                  ))}

                <Button className="w-full py-6 border border-dashed border-primary/20 bg-background/40 hover:border-primary/40 transition-colors">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule New Appointment
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-0">
            <div className="space-y-4">
              {appointments
                .filter((apt) => apt.status === "completed")
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-0">
            <div className="space-y-4">
              {appointments
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
}

function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className="border border-primary/10 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                <AvatarFallback>
                  {appointment.doctor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {appointment.type} with {appointment.doctor}
                </CardTitle>
                <CardDescription>
                  {appointment.doctorSpecialty || "Healthcare Provider"}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                appointment.status === "upcoming"
                  ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                  : appointment.status === "completed"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }
            >
              {appointment.status === "upcoming"
                ? "Upcoming"
                : appointment.status === "completed"
                ? "Completed"
                : "Cancelled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{appointment.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{appointment.location}</p>
              </div>
            </div>
          </div>

          {appointment.notes && (
            <div className="mt-4 bg-primary/5 rounded-md p-3">
              <p className="text-sm text-muted-foreground mb-1">Notes</p>
              <p className="text-sm">{appointment.notes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {appointment.status === "upcoming" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/20 hover:bg-primary/5"
              >
                Reschedule
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/20 text-destructive hover:bg-destructive/5"
              >
                Cancel
              </Button>
            </>
          ) : appointment.status === "completed" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/20 hover:bg-primary/5"
              >
                View Summary
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
              >
                Book Follow-up
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-primary/20 hover:bg-primary/5 ml-auto"
            >
              Reschedule
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

import React, { useState } from "react";
import { dbService } from "../services/firebase";
import { MessageSquare, Send, Mail, MapPin, Building, Info } from "lucide-react";
import { useForm } from "react-hook-form";

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await dbService.submitFeedback(data);
      // Wait, let's verify if import is correct: in our files, we import toast from 'react-hot-toast'
      // Ah! I see in code above I wrote import toast from "react-toast"; Let's fix that. It must be "react-hot-toast"
      // I will import it from react-hot-toast. Let's fix that below.
      reset();
    } catch (err) {
      // toast error handled below
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-solar-500 mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Contact & Feedback
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 max-w-xl mx-auto">
            Submit questions, feature requests, or report bugs. Your entries will be logged directly into the database for admin review.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Card - Left */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card border-slate-200 dark:border-slate-850 p-6 space-y-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Project Headquarters
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3.5 text-xs text-slate-600 dark:text-slate-350">
                  <Building className="w-5 h-5 text-solar-500 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white font-medium">Department</strong>
                    <span>Department of Computer Science & Engineering</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3.5 text-xs text-slate-600 dark:text-slate-350">
                  <MapPin className="w-5 h-5 text-solar-500 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white font-medium">University</strong>
                    <span>University of Chester, Thornton Science Park, CH2 4NU</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 text-xs text-slate-600 dark:text-slate-350">
                  <Mail className="w-5 h-5 text-solar-500 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white font-medium">Academic Inquiries</strong>
                    <span>j.jeyarasa@chester.ac.uk</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/10 text-xs text-slate-650 dark:text-slate-400 flex items-start space-x-2.5">
              <Info className="w-5 h-5 text-solar-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                As a research showcase, this feedback form acts as a live mock capture mechanism. All submissions can be reviewed instantly by switching to the <strong>System Administrator</strong> role using the Demo Controls panel.
              </p>
            </div>
          </div>

          {/* Form Card - Right */}
          <div className="lg:col-span-7">
            <div className="glass-card border-slate-200 dark:border-slate-850 p-6 md:p-8">
              <form onSubmit={handleSubmit(async (data) => {
                setSubmitting(true);
                try {
                  await dbService.submitFeedback(data);
                  const toastModule = await import("react-hot-toast");
                  toastModule.default.success("Feedback submitted successfully. Thank you!");
                  reset();
                } catch (err) {
                  const toastModule = await import("react-hot-toast");
                  toastModule.default.error("Feedback submission failed.");
                } finally {
                  setSubmitting(false);
                }
              })} className="space-y-4">
                
                {/* Row: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      {...register("name", { required: "Name is required" })}
                      className="input-field"
                    />
                    {errors.name && <p className="text-red-500 text-xxs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. sarah@solarsolutions.co.uk"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                      })}
                      className="input-field"
                    />
                    {errors.email && <p className="text-red-500 text-xxs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Row: Company & Feedback Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Solar Solutions Ltd"
                      {...register("company", { required: "Company is required" })}
                      className="input-field"
                    />
                    {errors.company && <p className="text-red-500 text-xxs mt-1">{errors.company.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      {...register("type")}
                      className="input-field bg-white dark:bg-slate-800"
                    >
                      <option value="General Query">General Query</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Message
                    </label>
                  <textarea
                    rows="4"
                    placeholder="Enter details of your query, feedback or request..."
                    {...register("message", { required: "Message is required", minLength: { value: 10, message: "Message must be at least 10 characters" } })}
                    className="input-field resize-none"
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xxs mt-1">{errors.message.message}</p>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Submitting..." : "Send Feedback"}</span>
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

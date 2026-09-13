"use client";

import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import toast from "react-hot-toast";
import { PiWarningCircle } from "react-icons/pi";
import * as Yup from "yup";
import { createBookingRequest } from "@/lib/api/cars";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { BookingRequest } from "@/types/car";
import css from "./BookingForm.module.css";

const initialValues: BookingRequest = {
  name: "",
  email: "",
  comment: "",
};

// Yup's own email check accepts addresses like `test@test` that the backend
// rejects, so this mirrors the backend: no leading, trailing or doubled dots,
// and a dotted domain ending in a TLD of at least two letters.
const EMAIL_PATTERN =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .matches(/\p{L}/u, "Please enter your name.")
    .min(2, "Please enter your name.")
    .max(60, "Name is too long")
    .required("Please enter your name."),
  email: Yup.string()
    .trim()
    .matches(EMAIL_PATTERN, "Please enter your email.")
    .required("Please enter your email."),
  comment: Yup.string()
    .trim()
    .max(500, "Comment is too long")
    .required("Comment is required"),
});

interface BookingFormProps {
  carId: string;
}

export default function BookingForm({ carId }: BookingFormProps) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (booking: BookingRequest) =>
      createBookingRequest(carId, booking),
  });

  const handleSubmit = async (
    values: BookingRequest,
    helpers: FormikHelpers<BookingRequest>,
  ) => {
    try {
      const response = await mutateAsync(validationSchema.cast(values));
      toast.success(response.message);
      helpers.resetForm();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Could not send your booking request. Please try again.",
        ),
      );
    }
  };

  return (
    <section className={css["booking-form"]}>
      <h2 className={css["booking-form__title"]}>Book your car now</h2>
      <p className={css["booking-form__subtitle"]}>
        Stay connected! We are always ready to help you.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => {
          const fieldClass = (name: keyof BookingRequest) =>
            `${css["booking-form__input"]} ${
              errors[name] && touched[name]
                ? css["booking-form__input--invalid"]
                : ""
            }`;
          const isInvalid = (name: keyof BookingRequest) =>
            Boolean(errors[name] && touched[name]);

          return (
            <Form className={css["booking-form__form"]} noValidate>
              <div className={css["booking-form__field"]}>
                {isInvalid("name") && (
                  <span className={css["booking-form__flag"]}>Name*</span>
                )}
                <Field
                  name="name"
                  type="text"
                  placeholder="Name*"
                  aria-label="Name"
                  aria-invalid={isInvalid("name")}
                  aria-describedby={
                    isInvalid("name") ? "booking-name-error" : undefined
                  }
                  autoComplete="name"
                  className={fieldClass("name")}
                />
                {isInvalid("name") && (
                  <PiWarningCircle
                    className={css["booking-form__warning"]}
                    aria-hidden="true"
                  />
                )}
                <ErrorMessage
                  id="booking-name-error"
                  name="name"
                  component="span"
                  className={css["booking-form__error"]}
                />
              </div>

              <div className={css["booking-form__field"]}>
                {isInvalid("email") && (
                  <span className={css["booking-form__flag"]}>Email*</span>
                )}
                <Field
                  name="email"
                  type="email"
                  placeholder="Email*"
                  aria-label="Email"
                  aria-invalid={isInvalid("email")}
                  aria-describedby={
                    isInvalid("email") ? "booking-email-error" : undefined
                  }
                  autoComplete="email"
                  className={fieldClass("email")}
                />
                {isInvalid("email") && (
                  <PiWarningCircle
                    className={css["booking-form__warning"]}
                    aria-hidden="true"
                  />
                )}
                <ErrorMessage
                  id="booking-email-error"
                  name="email"
                  component="span"
                  className={css["booking-form__error"]}
                />
              </div>

              <div className={css["booking-form__field"]}>
                <Field
                  as="textarea"
                  name="comment"
                  rows={3}
                  placeholder="Comment"
                  aria-label="Comment"
                  aria-invalid={isInvalid("comment")}
                  aria-describedby={
                    isInvalid("comment") ? "booking-comment-error" : undefined
                  }
                  autoComplete="off"
                  className={`${fieldClass("comment")} ${css["booking-form__textarea"]}`}
                />
                {isInvalid("comment") && (
                  <PiWarningCircle
                    className={css["booking-form__warning"]}
                    aria-hidden="true"
                  />
                )}
                <ErrorMessage
                  id="booking-comment-error"
                  name="comment"
                  component="span"
                  className={css["booking-form__error"]}
                />
              </div>

              <button
                type="submit"
                className={css["booking-form__submit"]}
                disabled={isPending}
              >
                {isPending ? "Sending..." : "Send"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </section>
  );
}

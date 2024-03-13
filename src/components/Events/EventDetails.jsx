import { Link, Outlet, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteEvent, fetchEvent } from "../../util/http.js";
import ErrorBlock from "./../UI/ErrorBlock";

export default function EventDetails() {
  const { id } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const { mutate } = useMutation({
    mutationFn: deleteEvent,
  });

  let content;

  if (isPending)
    content = (
      <div id="event-details-content" className="center">
        <p>Fetching event data...</p>
      </div>
    );

  if (isError) {
    content = (
      <div id="event-details-content" className="center">
        <ErrorBlock
          title={"Failed to load event"}
          message={
            error.info?.message ||
            "Failed to fetch event data, please try again later"
          }
        />
      </div>
    );
  }

  if (data) {
    const { title, image, location, date, time, description } = data;
    content = (
      <>
        <header>
          <h1>{title}</h1>
          <nav>
            <button onClick={() => mutate(id)}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${image}`} alt="" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {date}:{time}
              </time>
            </div>
            <p id="event-details-description">{description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}

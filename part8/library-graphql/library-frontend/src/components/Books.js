import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genreSelected, setgenreSelected] = useState("all genres");
  const [allGenres, setGenres] = useState(["all genres"]);

  const books = useQuery(ALL_BOOKS);

  useEffect(() => {
    const onCompleted = (books) => {
      for (const book of books.data.allBooks) {
        for (const genre of book.genres) {
          if (!allGenres.includes(genre)) {
            setGenres(allGenres.concat(genre));
          }
        }
      }
    };
    if (onCompleted && !books.loading) {
      onCompleted(books);
    }
  }, [books.loading, books.data]);

  if (!props.show) {
    return null;
  }

  if (books.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks
            .filter(
              (a) =>
                genreSelected === "all genres" ||
                a.genres.includes(genreSelected)
            )
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {allGenres.map((a) => (
        <button key={a} onClick={() => setgenreSelected(a)}>
          {a}
        </button>
      ))}
    </div>
  );
};

export default Books;

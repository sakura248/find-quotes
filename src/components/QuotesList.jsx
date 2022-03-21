import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { favoriteQuotesRef, quotesRef } from "../firestore-refs";
// import DeleteHandler from "../hooks/firestore/DeleteHandler";
// import FavHandler from "../hooks/firestore/FavHandler";
import FetchCharacterList from "../hooks/firestore/FetchCharacterList";
import FetchLikedList from "../hooks/firestore/FetchLikedList";
import FetchQuoteList from "../hooks/firestore/FetchQuoteList";
import FetchTvShow from "../hooks/firestore/FetchTvShow";
import useAuthStatus from "../hooks/useAuthStatus";
import Quote from "./ListItem/Quote";

const appElement = document.getElementById("content");
Modal.setAppElement(appElement);

export const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    backgroundColor: "#f2f2f2",
  },
};

function QuotesList({ type }) {
  const { loggedIn, uid } = useAuthStatus();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { fetchQuoteList, quoteList } = FetchQuoteList();
  const { fetchTvShow, tvShowList } = FetchTvShow();
  const { fetchLiked, likedList } = FetchLikedList();
  const { fetchCharacter, characterList } = FetchCharacterList();
  console.log(type);

  useEffect(() => {
    fetchQuoteList(type, uid);
    fetchLiked();
    fetchTvShow();
    fetchCharacter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, uid]);

  console.log("quoteList", quoteList);

  const deleteHandler = (id) => {
    if (loggedIn) {
      if (window.confirm("Are you sure?")) {
        const targetRef = doc(quotesRef, id);
        deleteDoc(targetRef);

        dispatch({ type: "DELETE_QUOTE", id });
      }
    } else {
      navigate("/Login", { from: location });
    }
  };

  const favHandler = async (quoteItem) => {
    if (loggedIn) {
      if (quoteItem.isLiked.length === 0) {
        const data = {
          id_user: uid,
          id_quote: quoteItem.id,
        };
        addDoc(favoriteQuotesRef, data);
        setDoc(quotesRef, { isLiked: uid }, { merge: true });
      } else {
        const targetQuery = query(
          favoriteQuotesRef,
          where("id_quote", "==", quoteItem.id)
        );
        const querySnapShot = await getDocs(targetQuery);
        const id = querySnapShot.docs.map((item) => item.id).toString();
        const targetRef = doc(favoriteQuotesRef, id);
        await deleteDoc(targetRef);

        setDoc(quotesRef, { isLiked: "" }, { merge: true });
      }
    } else {
      navigate("/Login", { from: location });
    }
  };

  return (
    <div className="container mx-auto">
      <Quote
        loggedIn={loggedIn}
        favHandler={favHandler}
        deleteHandler={deleteHandler}
        // type={type}
        quoteList={quoteList}
        likedList={likedList}
        tvShowList={tvShowList}
        characterList={characterList}
      />
    </div>
  );
}

QuotesList.propTypes = {
  type: PropTypes.string,
};

export default QuotesList;

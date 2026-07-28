import { Link, useNavigate } from "react-router-dom";

import {
  Home,
  ArrowLeft,
} from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        min-h-screen
        bg-background
        pt-16
        flex
        items-center
        justify-center
        px-4
      "
    >

      <div
        className="
          max-w-2xl
          text-center
        "
      >

        {/* brand */}
        <p
          className="
            mb-4
            text-primary
            font-medium
            tracking-[0.2em]
            uppercase
          "
        >
          Flint
        </p>


        {/* 404 */}
        <h1
          className="
            text-7xl
            sm:text-8xl
            md:text-9xl
            font-bold
            text-primary
            mb-4
            select-none
          "
        >
          404
        </h1>


        {/* title */}
        <h2
          className="
            text-3xl
            md:text-5xl
            font-bold
            text-foreground
            mb-5
          "
        >
          Page Not Found
        </h2>


        {/* description */}
        <p
          className="
            max-w-xl
            mx-auto
            text-lg
            text-muted-foreground
            leading-relaxed
            mb-10
          "
        >
          The page you're looking for
          doesn’t exist, may have been
          moved, or is no longer
          available.
        </p>


        {/* actions */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            justify-center
            gap-4
          "
        >

          <Link
            to="/"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-primary
              text-primary-foreground
              font-medium
              hover:scale-105
              active:scale-95
              transition-all
            "
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>


          <button
            onClick={() =>
              navigate(-1)
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-secondary
              text-foreground
              font-medium
              hover:bg-secondary/80
              active:scale-95
              transition-all
            "
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

        </div>

      </div>
    </div>
  );
};

export default NotFound;
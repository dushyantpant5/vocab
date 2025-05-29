CREATE OR REPLACE PROCEDURE public.update_user_word_analytics()
LANGUAGE plpgsql
AS $$
DECLARE
  current_date DATE;
BEGIN
  -- Loop through the last 7 days excluding today
  FOR current_date IN (CURRENT_DATE - INTERVAL '7 days')::DATE .. (CURRENT_DATE - INTERVAL '1 day')::DATE LOOP

    -- Insert or update word learning analytics for each user on that specific date
    INSERT INTO public.user_word_analytics (
      userid,
      date,
      words_learned_count,
      created_at,
      updated_at
    )
    SELECT
      userid,
      current_date AS date,
      COUNT(*) AS words_learned_count,
      now() AS created_at,
      now() AS updated_at
    FROM public.wordprogress
    WHERE learnedatdate = current_date
      AND islearned = true
    GROUP BY userid

    -- If record exists for the same user and date, update it
    ON CONFLICT (userid, date) DO UPDATE
    SET words_learned_count = EXCLUDED.words_learned_count,
        updated_at = now();

  END LOOP;
END;
$$;

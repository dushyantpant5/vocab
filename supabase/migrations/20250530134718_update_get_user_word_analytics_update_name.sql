CREATE OR REPLACE PROCEDURE public.get_user_word_analytics(run_type text default 'auto')
LANGUAGE plpgsql
AS $$
DECLARE
  current_date_var DATE := CURRENT_DATE - INTERVAL '7 days';
  end_date DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
  -- Loop over each date from 7 days ago up to yesterday
  WHILE current_date_var <= end_date LOOP
    -- Insert or update analytics for each user on current_date_var
    INSERT INTO public.user_word_analytics (
      userid,
      date,
      words_learned_count,
      created_at,
      updated_at
    )
    SELECT
      userid,
      current_date_var AS date,
      COUNT(*) AS words_learned_count,
      now() AS created_at,
      now() AS updated_at
    FROM public.wordprogress
    WHERE "learnedAtDate" = current_date_var
      AND islearned = true
    GROUP BY userid
    ON CONFLICT (userid, date) DO UPDATE
    SET words_learned_count = EXCLUDED.words_learned_count,
        updated_at = now();

    -- Move to next date
    current_date_var := current_date_var + INTERVAL '1 day';
  END LOOP;

  -- Insert a log entry for the function run
  INSERT INTO function_logs(function_name, run_type)
  VALUES ('get_user_word_analytics', run_type);

END;
$$;

CREATE OR REPLACE FUNCTION public.assign_daily_words()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID; --Store User ID
  v_word_id UUID; --Store Word ID
  unlearned_count INT; --Count of unlearned words for the user
BEGIN
  -- Loop through all users
  FOR v_user_id IN SELECT id FROM user_profiles LOOP

    -- STEP 1: Log up to 5 unlearned words (already in wordprogress)
    FOR v_word_id IN
      SELECT wordid FROM wordprogress
      WHERE userid = v_user_id AND (islearned IS FALSE OR islearned IS NULL)
      LIMIT 5 -- Limit to 5 unlearned words
    LOOP
      -- Insert into assignedwords (log table), avoid duplicates
      INSERT INTO assignedwords (user_id, word_id, assigned_at)
      VALUES (v_user_id, v_word_id, now())
      ON CONFLICT (user_id, word_id) DO NOTHING;

      -- Update updatedat in wordprogress for this word-user pair
      UPDATE wordprogress
      SET updatedat = now()
      WHERE userid = v_user_id AND wordid = v_word_id;
    END LOOP;

    -- STEP 2: Count unlearned words already assigned
    SELECT COUNT(*) INTO unlearned_count
    FROM wordprogress
    WHERE userid = v_user_id AND (islearned IS FALSE OR islearned IS NULL);

    -- STEP 3: If less than 5, add new words to make total = 5
    IF unlearned_count < 5 THEN
      FOR v_word_id IN
        SELECT id FROM words
        WHERE id NOT IN (
          SELECT wordid FROM wordprogress WHERE userid = v_user_id
        )
        ORDER BY random()
        LIMIT (5 - unlearned_count)
      LOOP
        -- Insert into assignedwords log
        INSERT INTO assignedwords (user_id, word_id, assigned_at)
        VALUES (v_user_id, v_word_id, now())
        ON CONFLICT (user_id, word_id) DO NOTHING;

        -- Insert new row into wordprogress
        INSERT INTO wordprogress (
          id, userid, wordid, islearned, lastseenat, createdat, updatedat
        ) VALUES (
          gen_random_uuid(), v_user_id, v_word_id, FALSE, now(), now(), now()
        );
      END LOOP;
    END IF;

  END LOOP;
END;
$$;

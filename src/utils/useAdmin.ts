import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "./firebase";

export function useAdmin(uid: string | null | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(!!uid); // loading only when we have a uid

  useEffect(() => {
    if (!uid) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    const r = ref(db, `roles/${uid}/isAdmin`);
    const unsub = onValue(
      r,
      (snap) => {
        setIsAdmin(Boolean(snap.val() === true));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [uid]);

  return { isAdmin, loading };
}

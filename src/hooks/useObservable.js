import { useEffect, useState } from "react";

export function useObservable(subject, initialValue) {
  const [value, setValue] = useState(
    initialValue !== undefined ? initialValue : subject.value
  );

  useEffect(() => {
    const sub = subject.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [subject]);

  return value;
}

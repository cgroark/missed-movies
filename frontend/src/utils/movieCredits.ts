interface CrewMember {
  job: string;
  name: string;
}

// Share in-flight and completed lookups across cards for the same TMDB movie.
const directors = new Map<number, Promise<string>>();

export function getMovieDirector(movieId: number): Promise<string> {
  const cached = directors.get(movieId);
  if (cached) return cached;

  const request = (async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_OMDB_ACCESS_TOKEN}` },
      });
      if (!response.ok) throw new Error('Unable to load movie credits');
      const credits: { crew?: CrewMember[] } = await response.json();
      return [
        ...new Set(
          (credits.crew ?? [])
            .filter(member => member.job === 'Director')
            .map(member => member.name)
        ),
      ].join(', ');
    } catch (error) {
      // A later opening can retry a failed lookup.
      directors.delete(movieId);
      throw error;
    }
  })();
  directors.set(movieId, request);
  return request;
}

/* eslint-disable */
import { offlineExchange } from '@urql/exchange-graphcache';
import type { Resolver as GraphCacheResolver, UpdateResolver as GraphCacheUpdateResolver, OptimisticMutationResolver as GraphCacheOptimisticMutationResolver } from '@urql/exchange-graphcache';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** ISO 3166-1 alpha-2 country code */
  CountryCode: { input: any; output: any; }
  /** 8 digit long date integer (YYYYMMDD). Unknown dates represented by 0. E.g. 2016: 20160000, May 1976: 19760500 */
  FuzzyDateInt: { input: any; output: any; }
  Json: { input: any; output: any; }
};

/** Notification for when a activity is liked */
export type ActivityLikeNotification = {
  __typename?: 'ActivityLikeNotification';
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The id of the activity which was liked */
  activityId: Scalars['Int']['output'];
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who liked the activity */
  user?: Maybe<User>;
  /** The id of the user who liked to the activity */
  userId: Scalars['Int']['output'];
};

/** Notification for when authenticated user is @ mentioned in activity or reply */
export type ActivityMentionNotification = {
  __typename?: 'ActivityMentionNotification';
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The id of the activity where mentioned */
  activityId: Scalars['Int']['output'];
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who mentioned the authenticated user */
  user?: Maybe<User>;
  /** The id of the user who mentioned the authenticated user */
  userId: Scalars['Int']['output'];
};

/** Notification for when a user is send an activity message */
export type ActivityMessageNotification = {
  __typename?: 'ActivityMessageNotification';
  /** The id of the activity message */
  activityId: Scalars['Int']['output'];
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The message activity */
  message?: Maybe<MessageActivity>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who sent the message */
  user?: Maybe<User>;
  /** The if of the user who send the message */
  userId: Scalars['Int']['output'];
};

/** Replay to an activity item */
export type ActivityReply = {
  __typename?: 'ActivityReply';
  /** The id of the parent activity */
  activityId?: Maybe<Scalars['Int']['output']>;
  /** The time the reply was created at */
  createdAt: Scalars['Int']['output'];
  /** The id of the reply */
  id: Scalars['Int']['output'];
  /** If the currently authenticated user liked the reply */
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  /** The amount of likes the reply has */
  likeCount: Scalars['Int']['output'];
  /** The users who liked the reply */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The reply text */
  text?: Maybe<Scalars['String']['output']>;
  /** The user who created reply */
  user?: Maybe<User>;
  /** The id of the replies creator */
  userId?: Maybe<Scalars['Int']['output']>;
};


/** Replay to an activity item */
export type ActivityReplyTextArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Notification for when a activity reply is liked */
export type ActivityReplyLikeNotification = {
  __typename?: 'ActivityReplyLikeNotification';
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The id of the activity where the reply which was liked */
  activityId: Scalars['Int']['output'];
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who liked the activity reply */
  user?: Maybe<User>;
  /** The id of the user who liked to the activity reply */
  userId: Scalars['Int']['output'];
};

/** Notification for when a user replies to the authenticated users activity */
export type ActivityReplyNotification = {
  __typename?: 'ActivityReplyNotification';
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The id of the activity which was replied too */
  activityId: Scalars['Int']['output'];
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who replied to the activity */
  user?: Maybe<User>;
  /** The id of the user who replied to the activity */
  userId: Scalars['Int']['output'];
};

/** Notification for when a user replies to activity the authenticated user has replied to */
export type ActivityReplySubscribedNotification = {
  __typename?: 'ActivityReplySubscribedNotification';
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The id of the activity which was replied too */
  activityId: Scalars['Int']['output'];
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who replied to the activity */
  user?: Maybe<User>;
  /** The id of the user who replied to the activity */
  userId: Scalars['Int']['output'];
};

/** Activity sort enums */
export enum ActivitySort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Pinned = 'PINNED'
}

/** Activity type enum. */
export enum ActivityType {
  /** A anime list update activity */
  AnimeList = 'ANIME_LIST',
  /** A manga list update activity */
  MangaList = 'MANGA_LIST',
  /** Anime & Manga list update, only used in query arguments */
  MediaList = 'MEDIA_LIST',
  /** A text message activity sent to another user */
  Message = 'MESSAGE',
  /** A text activity */
  Text = 'TEXT'
}

/** Activity union type */
export type ActivityUnion = ListActivity | MessageActivity | TextActivity;

/** Notification for when an episode of anime airs */
export type AiringNotification = {
  __typename?: 'AiringNotification';
  /** The id of the aired anime */
  animeId: Scalars['Int']['output'];
  /** The notification context text */
  contexts?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The episode number that just aired */
  episode: Scalars['Int']['output'];
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The associated media of the airing schedule */
  media?: Maybe<Media>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
};

/** Score & Watcher stats for airing anime by episode and mid-week */
export type AiringProgression = {
  __typename?: 'AiringProgression';
  /** The episode the stats were recorded at. .5 is the mid point between 2 episodes airing dates. */
  episode?: Maybe<Scalars['Float']['output']>;
  /** The average score for the media */
  score?: Maybe<Scalars['Float']['output']>;
  /** The amount of users watching the anime */
  watching?: Maybe<Scalars['Int']['output']>;
};

/** Media Airing Schedule. NOTE: We only aim to guarantee that FUTURE airing data is present and accurate. */
export type AiringSchedule = {
  __typename?: 'AiringSchedule';
  /** The time the episode airs at */
  airingAt: Scalars['Int']['output'];
  /** The airing episode number */
  episode: Scalars['Int']['output'];
  /** The id of the airing schedule item */
  id: Scalars['Int']['output'];
  /** The associate media of the airing episode */
  media?: Maybe<Media>;
  /** The associate media id of the airing episode */
  mediaId: Scalars['Int']['output'];
  /** Seconds until episode starts airing */
  timeUntilAiring: Scalars['Int']['output'];
};

export type AiringScheduleConnection = {
  __typename?: 'AiringScheduleConnection';
  edges?: Maybe<Array<Maybe<AiringScheduleEdge>>>;
  nodes?: Maybe<Array<Maybe<AiringSchedule>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** AiringSchedule connection edge */
export type AiringScheduleEdge = {
  __typename?: 'AiringScheduleEdge';
  /** The id of the connection */
  id?: Maybe<Scalars['Int']['output']>;
  node?: Maybe<AiringSchedule>;
};

export type AiringScheduleInput = {
  airingAt?: InputMaybe<Scalars['Int']['input']>;
  episode?: InputMaybe<Scalars['Int']['input']>;
  timeUntilAiring?: InputMaybe<Scalars['Int']['input']>;
};

/** Airing schedule sort enums */
export enum AiringSort {
  Episode = 'EPISODE',
  EpisodeDesc = 'EPISODE_DESC',
  Id = 'ID',
  IdDesc = 'ID_DESC',
  MediaId = 'MEDIA_ID',
  MediaIdDesc = 'MEDIA_ID_DESC',
  Time = 'TIME',
  TimeDesc = 'TIME_DESC'
}

export type AniChartHighlightInput = {
  highlight?: InputMaybe<Scalars['String']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
};

export type AniChartUser = {
  __typename?: 'AniChartUser';
  highlights?: Maybe<Scalars['Json']['output']>;
  settings?: Maybe<Scalars['Json']['output']>;
  user?: Maybe<User>;
};

/** A character that features in an anime or manga */
export type Character = {
  __typename?: 'Character';
  /** The character's age. Note this is a string, not an int, it may contain further text and additional ages. */
  age?: Maybe<Scalars['String']['output']>;
  /** The characters blood type */
  bloodType?: Maybe<Scalars['String']['output']>;
  /** The character's birth date */
  dateOfBirth?: Maybe<FuzzyDate>;
  /** A general description of the character */
  description?: Maybe<Scalars['String']['output']>;
  /** The amount of user's who have favourited the character */
  favourites?: Maybe<Scalars['Int']['output']>;
  /** The character's gender. Usually Male, Female, or Non-binary but can be any string. */
  gender?: Maybe<Scalars['String']['output']>;
  /** The id of the character */
  id: Scalars['Int']['output'];
  /** Character images */
  image?: Maybe<CharacterImage>;
  /** If the character is marked as favourite by the currently authenticated user */
  isFavourite: Scalars['Boolean']['output'];
  /** If the character is blocked from being added to favourites */
  isFavouriteBlocked: Scalars['Boolean']['output'];
  /** Media that includes the character */
  media?: Maybe<MediaConnection>;
  /** Notes for site moderators */
  modNotes?: Maybe<Scalars['String']['output']>;
  /** The names of the character */
  name?: Maybe<CharacterName>;
  /** The url for the character page on the AniList website */
  siteUrl?: Maybe<Scalars['String']['output']>;
  /** @deprecated No data available */
  updatedAt?: Maybe<Scalars['Int']['output']>;
};


/** A character that features in an anime or manga */
export type CharacterDescriptionArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']['input']>;
};


/** A character that features in an anime or manga */
export type CharacterMediaArgs = {
  onList?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  type?: InputMaybe<MediaType>;
};

export type CharacterConnection = {
  __typename?: 'CharacterConnection';
  edges?: Maybe<Array<Maybe<CharacterEdge>>>;
  nodes?: Maybe<Array<Maybe<Character>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Character connection edge */
export type CharacterEdge = {
  __typename?: 'CharacterEdge';
  /** The order the character should be displayed from the users favourites */
  favouriteOrder?: Maybe<Scalars['Int']['output']>;
  /** The id of the connection */
  id?: Maybe<Scalars['Int']['output']>;
  /** The media the character is in */
  media?: Maybe<Array<Maybe<Media>>>;
  /** Media specific character name */
  name?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Character>;
  /** The characters role in the media */
  role?: Maybe<CharacterRole>;
  /** The voice actors of the character with role date */
  voiceActorRoles?: Maybe<Array<Maybe<StaffRoleType>>>;
  /** The voice actors of the character */
  voiceActors?: Maybe<Array<Maybe<Staff>>>;
};


/** Character connection edge */
export type CharacterEdgeVoiceActorRolesArgs = {
  language?: InputMaybe<StaffLanguage>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};


/** Character connection edge */
export type CharacterEdgeVoiceActorsArgs = {
  language?: InputMaybe<StaffLanguage>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};

export type CharacterImage = {
  __typename?: 'CharacterImage';
  /** The character's image of media at its largest size */
  large?: Maybe<Scalars['String']['output']>;
  /** The character's image of media at medium size */
  medium?: Maybe<Scalars['String']['output']>;
};

/** The names of the character */
export type CharacterName = {
  __typename?: 'CharacterName';
  /** Other names the character might be referred to as */
  alternative?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Other names the character might be referred to as but are spoilers */
  alternativeSpoiler?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The character's given name */
  first?: Maybe<Scalars['String']['output']>;
  /** The character's first and last name */
  full?: Maybe<Scalars['String']['output']>;
  /** The character's surname */
  last?: Maybe<Scalars['String']['output']>;
  /** The character's middle name */
  middle?: Maybe<Scalars['String']['output']>;
  /** The character's full name in their native language */
  native?: Maybe<Scalars['String']['output']>;
  /** The currently authenticated users preferred name language. Default romaji for non-authenticated */
  userPreferred?: Maybe<Scalars['String']['output']>;
};

/** The names of the character */
export type CharacterNameInput = {
  /** Other names the character might be referred by */
  alternative?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Other names the character might be referred to as but are spoilers */
  alternativeSpoiler?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The character's given name */
  first?: InputMaybe<Scalars['String']['input']>;
  /** The character's surname */
  last?: InputMaybe<Scalars['String']['input']>;
  /** The character's middle name */
  middle?: InputMaybe<Scalars['String']['input']>;
  /** The character's full name in their native language */
  native?: InputMaybe<Scalars['String']['input']>;
};

/** The role the character plays in the media */
export enum CharacterRole {
  /** A background character in the media */
  Background = 'BACKGROUND',
  /** A primary character role in the media */
  Main = 'MAIN',
  /** A supporting character role in the media */
  Supporting = 'SUPPORTING'
}

/** Character sort enums */
export enum CharacterSort {
  Favourites = 'FAVOURITES',
  FavouritesDesc = 'FAVOURITES_DESC',
  Id = 'ID',
  IdDesc = 'ID_DESC',
  /** Order manually decided by moderators */
  Relevance = 'RELEVANCE',
  Role = 'ROLE',
  RoleDesc = 'ROLE_DESC',
  SearchMatch = 'SEARCH_MATCH'
}

/** A submission for a character that features in an anime or manga */
export type CharacterSubmission = {
  __typename?: 'CharacterSubmission';
  /** Data Mod assigned to handle the submission */
  assignee?: Maybe<User>;
  /** Character that the submission is referencing */
  character?: Maybe<Character>;
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the submission */
  id: Scalars['Int']['output'];
  /** Whether the submission is locked */
  locked?: Maybe<Scalars['Boolean']['output']>;
  /** Inner details of submission status */
  notes?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  /** Status of the submission */
  status?: Maybe<SubmissionStatus>;
  /** The character submission changes */
  submission?: Maybe<Character>;
  /** Submitter for the submission */
  submitter?: Maybe<User>;
};

export type CharacterSubmissionConnection = {
  __typename?: 'CharacterSubmissionConnection';
  edges?: Maybe<Array<Maybe<CharacterSubmissionEdge>>>;
  nodes?: Maybe<Array<Maybe<CharacterSubmission>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** CharacterSubmission connection edge */
export type CharacterSubmissionEdge = {
  __typename?: 'CharacterSubmissionEdge';
  node?: Maybe<CharacterSubmission>;
  /** The characters role in the media */
  role?: Maybe<CharacterRole>;
  /** The submitted voice actors of the character */
  submittedVoiceActors?: Maybe<Array<Maybe<StaffSubmission>>>;
  /** The voice actors of the character */
  voiceActors?: Maybe<Array<Maybe<Staff>>>;
};

/** Deleted data type */
export type Deleted = {
  __typename?: 'Deleted';
  /** If an item has been successfully deleted */
  deleted?: Maybe<Scalars['Boolean']['output']>;
};

export enum ExternalLinkMediaType {
  Anime = 'ANIME',
  Manga = 'MANGA',
  Staff = 'STAFF'
}

export enum ExternalLinkType {
  Info = 'INFO',
  Social = 'SOCIAL',
  Streaming = 'STREAMING'
}

/** User's favourite anime, manga, characters, staff & studios */
export type Favourites = {
  __typename?: 'Favourites';
  /** Favourite anime */
  anime?: Maybe<MediaConnection>;
  /** Favourite characters */
  characters?: Maybe<CharacterConnection>;
  /** Favourite manga */
  manga?: Maybe<MediaConnection>;
  /** Favourite staff */
  staff?: Maybe<StaffConnection>;
  /** Favourite studios */
  studios?: Maybe<StudioConnection>;
};


/** User's favourite anime, manga, characters, staff & studios */
export type FavouritesAnimeArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


/** User's favourite anime, manga, characters, staff & studios */
export type FavouritesCharactersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


/** User's favourite anime, manga, characters, staff & studios */
export type FavouritesMangaArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


/** User's favourite anime, manga, characters, staff & studios */
export type FavouritesStaffArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


/** User's favourite anime, manga, characters, staff & studios */
export type FavouritesStudiosArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};

/** Notification for when the authenticated user is followed by another user */
export type FollowingNotification = {
  __typename?: 'FollowingNotification';
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The liked activity */
  user?: Maybe<User>;
  /** The id of the user who followed the authenticated user */
  userId: Scalars['Int']['output'];
};

/** User's format statistics */
export type FormatStats = {
  __typename?: 'FormatStats';
  amount?: Maybe<Scalars['Int']['output']>;
  format?: Maybe<MediaFormat>;
};

/** Date object that allows for incomplete date values (fuzzy) */
export type FuzzyDate = {
  __typename?: 'FuzzyDate';
  /** Numeric Day (24) */
  day?: Maybe<Scalars['Int']['output']>;
  /** Numeric Month (3) */
  month?: Maybe<Scalars['Int']['output']>;
  /** Numeric Year (2017) */
  year?: Maybe<Scalars['Int']['output']>;
};

/** Date object that allows for incomplete date values (fuzzy) */
export type FuzzyDateInput = {
  /** Numeric Day (24) */
  day?: InputMaybe<Scalars['Int']['input']>;
  /** Numeric Month (3) */
  month?: InputMaybe<Scalars['Int']['input']>;
  /** Numeric Year (2017) */
  year?: InputMaybe<Scalars['Int']['input']>;
};

/** User's genre statistics */
export type GenreStats = {
  __typename?: 'GenreStats';
  amount?: Maybe<Scalars['Int']['output']>;
  genre?: Maybe<Scalars['String']['output']>;
  meanScore?: Maybe<Scalars['Int']['output']>;
  /** The amount of time in minutes the genre has been watched by the user */
  timeWatched?: Maybe<Scalars['Int']['output']>;
};

/** Page of data (Used for internal use only) */
export type InternalPage = {
  __typename?: 'InternalPage';
  activities?: Maybe<Array<Maybe<ActivityUnion>>>;
  activityReplies?: Maybe<Array<Maybe<ActivityReply>>>;
  airingSchedules?: Maybe<Array<Maybe<AiringSchedule>>>;
  characterSubmissions?: Maybe<Array<Maybe<CharacterSubmission>>>;
  characters?: Maybe<Array<Maybe<Character>>>;
  followers?: Maybe<Array<Maybe<User>>>;
  following?: Maybe<Array<Maybe<User>>>;
  likes?: Maybe<Array<Maybe<User>>>;
  media?: Maybe<Array<Maybe<Media>>>;
  mediaList?: Maybe<Array<Maybe<MediaList>>>;
  mediaSubmissions?: Maybe<Array<Maybe<MediaSubmission>>>;
  mediaTrends?: Maybe<Array<Maybe<MediaTrend>>>;
  modActions?: Maybe<Array<Maybe<ModAction>>>;
  notifications?: Maybe<Array<Maybe<NotificationUnion>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
  recommendations?: Maybe<Array<Maybe<Recommendation>>>;
  reports?: Maybe<Array<Maybe<Report>>>;
  reviews?: Maybe<Array<Maybe<Review>>>;
  revisionHistory?: Maybe<Array<Maybe<RevisionHistory>>>;
  staff?: Maybe<Array<Maybe<Staff>>>;
  staffSubmissions?: Maybe<Array<Maybe<StaffSubmission>>>;
  studios?: Maybe<Array<Maybe<Studio>>>;
  threadComments?: Maybe<Array<Maybe<ThreadComment>>>;
  threads?: Maybe<Array<Maybe<Thread>>>;
  userBlockSearch?: Maybe<Array<Maybe<User>>>;
  users?: Maybe<Array<Maybe<User>>>;
};


/** Page of data (Used for internal use only) */
export type InternalPageActivitiesArgs = {
  createdAt?: InputMaybe<Scalars['Int']['input']>;
  createdAt_greater?: InputMaybe<Scalars['Int']['input']>;
  createdAt_lesser?: InputMaybe<Scalars['Int']['input']>;
  hasReplies?: InputMaybe<Scalars['Boolean']['input']>;
  hasRepliesOrTypeText?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isFollowing?: InputMaybe<Scalars['Boolean']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']['input']>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  messengerId?: InputMaybe<Scalars['Int']['input']>;
  messengerId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  messengerId_not?: InputMaybe<Scalars['Int']['input']>;
  messengerId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  sort?: InputMaybe<Array<InputMaybe<ActivitySort>>>;
  type?: InputMaybe<ActivityType>;
  type_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  type_not?: InputMaybe<ActivityType>;
  type_not_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  userId?: InputMaybe<Scalars['Int']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  userId_not?: InputMaybe<Scalars['Int']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};


/** Page of data (Used for internal use only) */
export type InternalPageActivityRepliesArgs = {
  activityId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageAiringSchedulesArgs = {
  airingAt?: InputMaybe<Scalars['Int']['input']>;
  airingAt_greater?: InputMaybe<Scalars['Int']['input']>;
  airingAt_lesser?: InputMaybe<Scalars['Int']['input']>;
  episode?: InputMaybe<Scalars['Int']['input']>;
  episode_greater?: InputMaybe<Scalars['Int']['input']>;
  episode_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  episode_lesser?: InputMaybe<Scalars['Int']['input']>;
  episode_not?: InputMaybe<Scalars['Int']['input']>;
  episode_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']['input']>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notYetAired?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Array<InputMaybe<AiringSort>>>;
};


/** Page of data (Used for internal use only) */
export type InternalPageCharacterSubmissionsArgs = {
  assigneeId?: InputMaybe<Scalars['Int']['input']>;
  characterId?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<SubmissionSort>>>;
  status?: InputMaybe<SubmissionStatus>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageCharactersArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isBirthday?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
};


/** Page of data (Used for internal use only) */
export type InternalPageFollowersArgs = {
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  userId: Scalars['Int']['input'];
};


/** Page of data (Used for internal use only) */
export type InternalPageFollowingArgs = {
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  userId: Scalars['Int']['input'];
};


/** Page of data (Used for internal use only) */
export type InternalPageLikesArgs = {
  likeableId?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<LikeableType>;
};


/** Page of data (Used for internal use only) */
export type InternalPageMediaArgs = {
  averageScore?: InputMaybe<Scalars['Int']['input']>;
  averageScore_greater?: InputMaybe<Scalars['Int']['input']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']['input']>;
  averageScore_not?: InputMaybe<Scalars['Int']['input']>;
  chapters?: InputMaybe<Scalars['Int']['input']>;
  chapters_greater?: InputMaybe<Scalars['Int']['input']>;
  chapters_lesser?: InputMaybe<Scalars['Int']['input']>;
  countryOfOrigin?: InputMaybe<Scalars['CountryCode']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  duration_greater?: InputMaybe<Scalars['Int']['input']>;
  duration_lesser?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  endDate_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  endDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  endDate_like?: InputMaybe<Scalars['String']['input']>;
  episodes?: InputMaybe<Scalars['Int']['input']>;
  episodes_greater?: InputMaybe<Scalars['Int']['input']>;
  episodes_lesser?: InputMaybe<Scalars['Int']['input']>;
  format?: InputMaybe<MediaFormat>;
  format_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  format_not?: InputMaybe<MediaFormat>;
  format_not_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  genre?: InputMaybe<Scalars['String']['input']>;
  genre_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  genre_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  idMal?: InputMaybe<Scalars['Int']['input']>;
  idMal_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  idMal_not?: InputMaybe<Scalars['Int']['input']>;
  idMal_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isAdult?: InputMaybe<Scalars['Boolean']['input']>;
  isLicensed?: InputMaybe<Scalars['Boolean']['input']>;
  licensedBy?: InputMaybe<Scalars['String']['input']>;
  licensedById?: InputMaybe<Scalars['Int']['input']>;
  licensedById_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  licensedBy_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  minimumTagRank?: InputMaybe<Scalars['Int']['input']>;
  onList?: InputMaybe<Scalars['Boolean']['input']>;
  popularity?: InputMaybe<Scalars['Int']['input']>;
  popularity_greater?: InputMaybe<Scalars['Int']['input']>;
  popularity_lesser?: InputMaybe<Scalars['Int']['input']>;
  popularity_not?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  season?: InputMaybe<MediaSeason>;
  seasonYear?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  source?: InputMaybe<MediaSource>;
  source_in?: InputMaybe<Array<InputMaybe<MediaSource>>>;
  startDate?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startDate_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startDate_like?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MediaStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  status_not?: InputMaybe<MediaStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tagCategory?: InputMaybe<Scalars['String']['input']>;
  tagCategory_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tagCategory_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tag_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tag_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type?: InputMaybe<MediaType>;
  volumes?: InputMaybe<Scalars['Int']['input']>;
  volumes_greater?: InputMaybe<Scalars['Int']['input']>;
  volumes_lesser?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageMediaListArgs = {
  compareWithAuthList?: InputMaybe<Scalars['Boolean']['input']>;
  completedAt?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  completedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  completedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  completedAt_like?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isFollowing?: InputMaybe<Scalars['Boolean']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  notes_like?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaListSort>>>;
  startedAt?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startedAt_like?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MediaListStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not?: InputMaybe<MediaListStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  type?: InputMaybe<MediaType>;
  userId?: InputMaybe<Scalars['Int']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  userName?: InputMaybe<Scalars['String']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageMediaSubmissionsArgs = {
  assigneeId?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<SubmissionSort>>>;
  status?: InputMaybe<SubmissionStatus>;
  submissionId?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<MediaType>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageMediaTrendsArgs = {
  averageScore?: InputMaybe<Scalars['Int']['input']>;
  averageScore_greater?: InputMaybe<Scalars['Int']['input']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']['input']>;
  averageScore_not?: InputMaybe<Scalars['Int']['input']>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_greater?: InputMaybe<Scalars['Int']['input']>;
  date_lesser?: InputMaybe<Scalars['Int']['input']>;
  episode?: InputMaybe<Scalars['Int']['input']>;
  episode_greater?: InputMaybe<Scalars['Int']['input']>;
  episode_lesser?: InputMaybe<Scalars['Int']['input']>;
  episode_not?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']['input']>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  popularity?: InputMaybe<Scalars['Int']['input']>;
  popularity_greater?: InputMaybe<Scalars['Int']['input']>;
  popularity_lesser?: InputMaybe<Scalars['Int']['input']>;
  popularity_not?: InputMaybe<Scalars['Int']['input']>;
  releasing?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaTrendSort>>>;
  trending?: InputMaybe<Scalars['Int']['input']>;
  trending_greater?: InputMaybe<Scalars['Int']['input']>;
  trending_lesser?: InputMaybe<Scalars['Int']['input']>;
  trending_not?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageModActionsArgs = {
  modId?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageNotificationsArgs = {
  resetNotificationCount?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<NotificationType>;
  type_in?: InputMaybe<Array<InputMaybe<NotificationType>>>;
};


/** Page of data (Used for internal use only) */
export type InternalPageRecommendationsArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaRecommendationId?: InputMaybe<Scalars['Int']['input']>;
  onList?: InputMaybe<Scalars['Boolean']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  rating_greater?: InputMaybe<Scalars['Int']['input']>;
  rating_lesser?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<RecommendationSort>>>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageReportsArgs = {
  reportedId?: InputMaybe<Scalars['Int']['input']>;
  reporterId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageReviewsArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaType?: InputMaybe<MediaType>;
  sort?: InputMaybe<Array<InputMaybe<ReviewSort>>>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageRevisionHistoryArgs = {
  characterId?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  staffId?: InputMaybe<Scalars['Int']['input']>;
  studioId?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageStaffArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isBirthday?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};


/** Page of data (Used for internal use only) */
export type InternalPageStaffSubmissionsArgs = {
  assigneeId?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<SubmissionSort>>>;
  staffId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<SubmissionStatus>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageStudiosArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<StudioSort>>>;
};


/** Page of data (Used for internal use only) */
export type InternalPageThreadCommentsArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<ThreadCommentSort>>>;
  threadId?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageThreadsArgs = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaCategoryId?: InputMaybe<Scalars['Int']['input']>;
  replyUserId?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<ThreadSort>>>;
  subscribed?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageUserBlockSearchArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


/** Page of data (Used for internal use only) */
export type InternalPageUsersArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  isModerator?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
};

/** Types that can be liked */
export enum LikeableType {
  Activity = 'ACTIVITY',
  ActivityReply = 'ACTIVITY_REPLY',
  Thread = 'THREAD',
  ThreadComment = 'THREAD_COMMENT'
}

/** Likeable union type */
export type LikeableUnion = ActivityReply | ListActivity | MessageActivity | TextActivity | Thread | ThreadComment;

/** User list activity (anime & manga updates) */
export type ListActivity = {
  __typename?: 'ListActivity';
  /** The time the activity was created at */
  createdAt: Scalars['Int']['output'];
  /** The id of the activity */
  id: Scalars['Int']['output'];
  /** If the currently authenticated user liked the activity */
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  /** If the activity is locked and can receive replies */
  isLocked?: Maybe<Scalars['Boolean']['output']>;
  /** If the activity is pinned to the top of the users activity feed */
  isPinned?: Maybe<Scalars['Boolean']['output']>;
  /** If the currently authenticated user is subscribed to the activity */
  isSubscribed?: Maybe<Scalars['Boolean']['output']>;
  /** The amount of likes the activity has */
  likeCount: Scalars['Int']['output'];
  /** The users who liked the activity */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The associated media to the activity update */
  media?: Maybe<Media>;
  /** The list progress made */
  progress?: Maybe<Scalars['String']['output']>;
  /** The written replies to the activity */
  replies?: Maybe<Array<Maybe<ActivityReply>>>;
  /** The number of activity replies */
  replyCount: Scalars['Int']['output'];
  /** The url for the activity page on the AniList website */
  siteUrl?: Maybe<Scalars['String']['output']>;
  /** The list item's textual status */
  status?: Maybe<Scalars['String']['output']>;
  /** The type of activity */
  type?: Maybe<ActivityType>;
  /** The owner of the activity */
  user?: Maybe<User>;
  /** The user id of the activity's creator */
  userId?: Maybe<Scalars['Int']['output']>;
};

export type ListActivityOption = {
  __typename?: 'ListActivityOption';
  disabled?: Maybe<Scalars['Boolean']['output']>;
  type?: Maybe<MediaListStatus>;
};

export type ListActivityOptionInput = {
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<MediaListStatus>;
};

/** User's list score statistics */
export type ListScoreStats = {
  __typename?: 'ListScoreStats';
  meanScore?: Maybe<Scalars['Int']['output']>;
  standardDeviation?: Maybe<Scalars['Int']['output']>;
};

/** Anime or Manga */
export type Media = {
  __typename?: 'Media';
  /** The media's entire airing schedule */
  airingSchedule?: Maybe<AiringScheduleConnection>;
  /** If the media should have forum thread automatically created for it on airing episode release */
  autoCreateForumThread?: Maybe<Scalars['Boolean']['output']>;
  /** A weighted average score of all the user's scores of the media */
  averageScore?: Maybe<Scalars['Int']['output']>;
  /** The banner image of the media */
  bannerImage?: Maybe<Scalars['String']['output']>;
  /** The amount of chapters the manga has when complete */
  chapters?: Maybe<Scalars['Int']['output']>;
  /** The characters in the media */
  characters?: Maybe<CharacterConnection>;
  /** Where the media was created. (ISO 3166-1 alpha-2) */
  countryOfOrigin?: Maybe<Scalars['CountryCode']['output']>;
  /** The cover images of the media */
  coverImage?: Maybe<MediaCoverImage>;
  /** Short description of the media's story and characters */
  description?: Maybe<Scalars['String']['output']>;
  /** The general length of each anime episode in minutes */
  duration?: Maybe<Scalars['Int']['output']>;
  /** The last official release date of the media */
  endDate?: Maybe<FuzzyDate>;
  /** The amount of episodes the anime has when complete */
  episodes?: Maybe<Scalars['Int']['output']>;
  /** External links to another site related to the media */
  externalLinks?: Maybe<Array<Maybe<MediaExternalLink>>>;
  /** The amount of user's who have favourited the media */
  favourites?: Maybe<Scalars['Int']['output']>;
  /** The format the media was released in */
  format?: Maybe<MediaFormat>;
  /** The genres of the media */
  genres?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Official Twitter hashtags for the media */
  hashtag?: Maybe<Scalars['String']['output']>;
  /** The id of the media */
  id: Scalars['Int']['output'];
  /** The mal id of the media */
  idMal?: Maybe<Scalars['Int']['output']>;
  /** If the media is intended only for 18+ adult audiences */
  isAdult?: Maybe<Scalars['Boolean']['output']>;
  /** If the media is marked as favourite by the current authenticated user */
  isFavourite: Scalars['Boolean']['output'];
  /** If the media is blocked from being added to favourites */
  isFavouriteBlocked: Scalars['Boolean']['output'];
  /** If the media is officially licensed or a self-published doujin release */
  isLicensed?: Maybe<Scalars['Boolean']['output']>;
  /** Locked media may not be added to lists our favorited. This may be due to the entry pending for deletion or other reasons. */
  isLocked?: Maybe<Scalars['Boolean']['output']>;
  /** If the media is blocked from being recommended to/from */
  isRecommendationBlocked?: Maybe<Scalars['Boolean']['output']>;
  /** If the media is blocked from being reviewed */
  isReviewBlocked?: Maybe<Scalars['Boolean']['output']>;
  /** Mean score of all the user's scores of the media */
  meanScore?: Maybe<Scalars['Int']['output']>;
  /** The authenticated user's media list entry for the media */
  mediaListEntry?: Maybe<MediaList>;
  /** Notes for site moderators */
  modNotes?: Maybe<Scalars['String']['output']>;
  /** The media's next episode airing schedule */
  nextAiringEpisode?: Maybe<AiringSchedule>;
  /** The number of users with the media on their list */
  popularity?: Maybe<Scalars['Int']['output']>;
  /** The ranking of the media in a particular time span and format compared to other media */
  rankings?: Maybe<Array<Maybe<MediaRank>>>;
  /** User recommendations for similar media */
  recommendations?: Maybe<RecommendationConnection>;
  /** Other media in the same or connecting franchise */
  relations?: Maybe<MediaConnection>;
  /** User reviews of the media */
  reviews?: Maybe<ReviewConnection>;
  /** The season the media was initially released in */
  season?: Maybe<MediaSeason>;
  /**
   * The year & season the media was initially released in
   * @deprecated
   */
  seasonInt?: Maybe<Scalars['Int']['output']>;
  /** The season year the media was initially released in */
  seasonYear?: Maybe<Scalars['Int']['output']>;
  /** The url for the media page on the AniList website */
  siteUrl?: Maybe<Scalars['String']['output']>;
  /** Source type the media was adapted from. */
  source?: Maybe<MediaSource>;
  /** The staff who produced the media */
  staff?: Maybe<StaffConnection>;
  /** The first official release date of the media */
  startDate?: Maybe<FuzzyDate>;
  stats?: Maybe<MediaStats>;
  /** The current releasing status of the media */
  status?: Maybe<MediaStatus>;
  /** Data and links to legal streaming episodes on external sites */
  streamingEpisodes?: Maybe<Array<Maybe<MediaStreamingEpisode>>>;
  /** The companies who produced the media */
  studios?: Maybe<StudioConnection>;
  /** Alternative titles of the media */
  synonyms?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** List of tags that describes elements and themes of the media */
  tags?: Maybe<Array<Maybe<MediaTag>>>;
  /** The official titles of the media in various languages */
  title?: Maybe<MediaTitle>;
  /** Media trailer or advertisement */
  trailer?: Maybe<MediaTrailer>;
  /** The amount of related activity in the past hour */
  trending?: Maybe<Scalars['Int']['output']>;
  /** The media's daily trend stats */
  trends?: Maybe<MediaTrendConnection>;
  /** The type of the media; anime or manga */
  type?: Maybe<MediaType>;
  /** When the media's data was last updated */
  updatedAt?: Maybe<Scalars['Int']['output']>;
  /** The amount of volumes the manga has when complete */
  volumes?: Maybe<Scalars['Int']['output']>;
};


/** Anime or Manga */
export type MediaAiringScheduleArgs = {
  notYetAired?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


/** Anime or Manga */
export type MediaCharactersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<CharacterRole>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
};


/** Anime or Manga */
export type MediaDescriptionArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Anime or Manga */
export type MediaRecommendationsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<RecommendationSort>>>;
};


/** Anime or Manga */
export type MediaReviewsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<ReviewSort>>>;
};


/** Anime or Manga */
export type MediaSourceArgs = {
  version?: InputMaybe<Scalars['Int']['input']>;
};


/** Anime or Manga */
export type MediaStaffArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};


/** Anime or Manga */
export type MediaStatusArgs = {
  version?: InputMaybe<Scalars['Int']['input']>;
};


/** Anime or Manga */
export type MediaStudiosArgs = {
  isMain?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Array<InputMaybe<StudioSort>>>;
};


/** Anime or Manga */
export type MediaTrendsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  releasing?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaTrendSort>>>;
};

/** Internal - Media characters separated */
export type MediaCharacter = {
  __typename?: 'MediaCharacter';
  /** The characters in the media voiced by the parent actor */
  character?: Maybe<Character>;
  /** Media specific character name */
  characterName?: Maybe<Scalars['String']['output']>;
  dubGroup?: Maybe<Scalars['String']['output']>;
  /** The id of the connection */
  id?: Maybe<Scalars['Int']['output']>;
  /** The characters role in the media */
  role?: Maybe<CharacterRole>;
  roleNotes?: Maybe<Scalars['String']['output']>;
  /** The voice actor of the character */
  voiceActor?: Maybe<Staff>;
};

export type MediaConnection = {
  __typename?: 'MediaConnection';
  edges?: Maybe<Array<Maybe<MediaEdge>>>;
  nodes?: Maybe<Array<Maybe<Media>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

export type MediaCoverImage = {
  __typename?: 'MediaCoverImage';
  /** Average #hex color of cover image */
  color?: Maybe<Scalars['String']['output']>;
  /** The cover image url of the media at its largest size. If this size isn't available, large will be provided instead. */
  extraLarge?: Maybe<Scalars['String']['output']>;
  /** The cover image url of the media at a large size */
  large?: Maybe<Scalars['String']['output']>;
  /** The cover image url of the media at medium size */
  medium?: Maybe<Scalars['String']['output']>;
};

/** Notification for when a media entry's data was changed in a significant way impacting users' list tracking */
export type MediaDataChangeNotification = {
  __typename?: 'MediaDataChangeNotification';
  /** The reason for the media data change */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The media that received data changes */
  media?: Maybe<Media>;
  /** The id of the media that received data changes */
  mediaId: Scalars['Int']['output'];
  /** The reason for the media data change */
  reason?: Maybe<Scalars['String']['output']>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
};

/** Notification for when a media tracked in a user's list is deleted from the site */
export type MediaDeletionNotification = {
  __typename?: 'MediaDeletionNotification';
  /** The reason for the media deletion */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The title of the deleted media */
  deletedMediaTitle?: Maybe<Scalars['String']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The reason for the media deletion */
  reason?: Maybe<Scalars['String']['output']>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
};

/** Media connection edge */
export type MediaEdge = {
  __typename?: 'MediaEdge';
  /** Media specific character name */
  characterName?: Maybe<Scalars['String']['output']>;
  /** The characters role in the media */
  characterRole?: Maybe<CharacterRole>;
  /** The characters in the media voiced by the parent actor */
  characters?: Maybe<Array<Maybe<Character>>>;
  /** Used for grouping roles where multiple dubs exist for the same language. Either dubbing company name or language variant. */
  dubGroup?: Maybe<Scalars['String']['output']>;
  /** The order the media should be displayed from the users favourites */
  favouriteOrder?: Maybe<Scalars['Int']['output']>;
  /** The id of the connection */
  id?: Maybe<Scalars['Int']['output']>;
  /** If the studio is the main animation studio of the media (For Studio->MediaConnection field only) */
  isMainStudio: Scalars['Boolean']['output'];
  node?: Maybe<Media>;
  /** The type of relation to the parent model */
  relationType?: Maybe<MediaRelation>;
  /** Notes regarding the VA's role for the character */
  roleNotes?: Maybe<Scalars['String']['output']>;
  /** The role of the staff member in the production of the media */
  staffRole?: Maybe<Scalars['String']['output']>;
  /** The voice actors of the character with role date */
  voiceActorRoles?: Maybe<Array<Maybe<StaffRoleType>>>;
  /** The voice actors of the character */
  voiceActors?: Maybe<Array<Maybe<Staff>>>;
};


/** Media connection edge */
export type MediaEdgeRelationTypeArgs = {
  version?: InputMaybe<Scalars['Int']['input']>;
};


/** Media connection edge */
export type MediaEdgeVoiceActorRolesArgs = {
  language?: InputMaybe<StaffLanguage>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};


/** Media connection edge */
export type MediaEdgeVoiceActorsArgs = {
  language?: InputMaybe<StaffLanguage>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};

/** An external link to another site related to the media or staff member */
export type MediaExternalLink = {
  __typename?: 'MediaExternalLink';
  color?: Maybe<Scalars['String']['output']>;
  /** The icon image url of the site. Not available for all links. Transparent PNG 64x64 */
  icon?: Maybe<Scalars['String']['output']>;
  /** The id of the external link */
  id: Scalars['Int']['output'];
  isDisabled?: Maybe<Scalars['Boolean']['output']>;
  /** Language the site content is in. See Staff language field for values. */
  language?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  /** The links website site name */
  site: Scalars['String']['output'];
  /** The links website site id */
  siteId?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<ExternalLinkType>;
  /** The url of the external link or base url of link source */
  url?: Maybe<Scalars['String']['output']>;
};

/** An external link to another site related to the media */
export type MediaExternalLinkInput = {
  /** The id of the external link */
  id: Scalars['Int']['input'];
  /** The site location of the external link */
  site: Scalars['String']['input'];
  /** The url of the external link */
  url: Scalars['String']['input'];
};

/** The format the media was released in */
export enum MediaFormat {
  /** Professionally published manga with more than one chapter */
  Manga = 'MANGA',
  /** Anime movies with a theatrical release */
  Movie = 'MOVIE',
  /** Short anime released as a music video */
  Music = 'MUSIC',
  /** Written books released as a series of light novels */
  Novel = 'NOVEL',
  /** (Original Net Animation) Anime that have been originally released online or are only available through streaming services. */
  Ona = 'ONA',
  /** Manga with just one chapter */
  OneShot = 'ONE_SHOT',
  /** (Original Video Animation) Anime that have been released directly on DVD/Blu-ray without originally going through a theatrical release or television broadcast */
  Ova = 'OVA',
  /** Special episodes that have been included in DVD/Blu-ray releases, picture dramas, pilots, etc */
  Special = 'SPECIAL',
  /** Anime broadcast on television */
  Tv = 'TV',
  /** Anime which are under 15 minutes in length and broadcast on television */
  TvShort = 'TV_SHORT'
}

/** List of anime or manga */
export type MediaList = {
  __typename?: 'MediaList';
  /** Map of advanced scores with name keys */
  advancedScores?: Maybe<Scalars['Json']['output']>;
  /** When the entry was completed by the user */
  completedAt?: Maybe<FuzzyDate>;
  /** When the entry data was created */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** Map of booleans for which custom lists the entry are in */
  customLists?: Maybe<Scalars['Json']['output']>;
  /** If the entry shown be hidden from non-custom lists */
  hiddenFromStatusLists?: Maybe<Scalars['Boolean']['output']>;
  /** The id of the list entry */
  id: Scalars['Int']['output'];
  media?: Maybe<Media>;
  /** The id of the media */
  mediaId: Scalars['Int']['output'];
  /** Text notes */
  notes?: Maybe<Scalars['String']['output']>;
  /** Priority of planning */
  priority?: Maybe<Scalars['Int']['output']>;
  /** If the entry should only be visible to authenticated user */
  private?: Maybe<Scalars['Boolean']['output']>;
  /** The amount of episodes/chapters consumed by the user */
  progress?: Maybe<Scalars['Int']['output']>;
  /** The amount of volumes read by the user */
  progressVolumes?: Maybe<Scalars['Int']['output']>;
  /** The amount of times the user has rewatched/read the media */
  repeat?: Maybe<Scalars['Int']['output']>;
  /** The score of the entry */
  score?: Maybe<Scalars['Float']['output']>;
  /** When the entry was started by the user */
  startedAt?: Maybe<FuzzyDate>;
  /** The watching/reading status */
  status?: Maybe<MediaListStatus>;
  /** When the entry data was last updated */
  updatedAt?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
  /** The id of the user owner of the list entry */
  userId: Scalars['Int']['output'];
};


/** List of anime or manga */
export type MediaListCustomListsArgs = {
  asArray?: InputMaybe<Scalars['Boolean']['input']>;
};


/** List of anime or manga */
export type MediaListScoreArgs = {
  format?: InputMaybe<ScoreFormat>;
};

/** List of anime or manga */
export type MediaListCollection = {
  __typename?: 'MediaListCollection';
  /**
   * A map of media list entry arrays grouped by custom lists
   * @deprecated Not GraphQL spec compliant, use lists field instead.
   */
  customLists?: Maybe<Array<Maybe<Array<Maybe<MediaList>>>>>;
  /** If there is another chunk */
  hasNextChunk?: Maybe<Scalars['Boolean']['output']>;
  /** Grouped media list entries */
  lists?: Maybe<Array<Maybe<MediaListGroup>>>;
  /**
   * A map of media list entry arrays grouped by status
   * @deprecated Not GraphQL spec compliant, use lists field instead.
   */
  statusLists?: Maybe<Array<Maybe<Array<Maybe<MediaList>>>>>;
  /** The owner of the list */
  user?: Maybe<User>;
};


/** List of anime or manga */
export type MediaListCollectionCustomListsArgs = {
  asArray?: InputMaybe<Scalars['Boolean']['input']>;
};


/** List of anime or manga */
export type MediaListCollectionStatusListsArgs = {
  asArray?: InputMaybe<Scalars['Boolean']['input']>;
};

/** List group of anime or manga entries */
export type MediaListGroup = {
  __typename?: 'MediaListGroup';
  /** Media list entries */
  entries?: Maybe<Array<Maybe<MediaList>>>;
  isCustomList?: Maybe<Scalars['Boolean']['output']>;
  isSplitCompletedList?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<MediaListStatus>;
};

/** A user's list options */
export type MediaListOptions = {
  __typename?: 'MediaListOptions';
  /** The user's anime list options */
  animeList?: Maybe<MediaListTypeOptions>;
  /** The user's manga list options */
  mangaList?: Maybe<MediaListTypeOptions>;
  /** The default order list rows should be displayed in */
  rowOrder?: Maybe<Scalars['String']['output']>;
  /** The score format the user is using for media lists */
  scoreFormat?: Maybe<ScoreFormat>;
  /**
   * The list theme options for both lists
   * @deprecated No longer used
   */
  sharedTheme?: Maybe<Scalars['Json']['output']>;
  /**
   * If the shared theme should be used instead of the individual list themes
   * @deprecated No longer used
   */
  sharedThemeEnabled?: Maybe<Scalars['Boolean']['output']>;
  /** @deprecated No longer used */
  useLegacyLists?: Maybe<Scalars['Boolean']['output']>;
};

/** A user's list options for anime or manga lists */
export type MediaListOptionsInput = {
  /** The names of the user's advanced scoring sections */
  advancedScoring?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** If advanced scoring is enabled */
  advancedScoringEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** The names of the user's custom lists */
  customLists?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The order each list should be displayed in */
  sectionOrder?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** If the completed sections of the list should be separated by format */
  splitCompletedSectionByFormat?: InputMaybe<Scalars['Boolean']['input']>;
  /** list theme */
  theme?: InputMaybe<Scalars['String']['input']>;
};

/** Media list sort enums */
export enum MediaListSort {
  AddedTime = 'ADDED_TIME',
  AddedTimeDesc = 'ADDED_TIME_DESC',
  FinishedOn = 'FINISHED_ON',
  FinishedOnDesc = 'FINISHED_ON_DESC',
  MediaId = 'MEDIA_ID',
  MediaIdDesc = 'MEDIA_ID_DESC',
  MediaPopularity = 'MEDIA_POPULARITY',
  MediaPopularityDesc = 'MEDIA_POPULARITY_DESC',
  MediaTitleEnglish = 'MEDIA_TITLE_ENGLISH',
  MediaTitleEnglishDesc = 'MEDIA_TITLE_ENGLISH_DESC',
  MediaTitleNative = 'MEDIA_TITLE_NATIVE',
  MediaTitleNativeDesc = 'MEDIA_TITLE_NATIVE_DESC',
  MediaTitleRomaji = 'MEDIA_TITLE_ROMAJI',
  MediaTitleRomajiDesc = 'MEDIA_TITLE_ROMAJI_DESC',
  Priority = 'PRIORITY',
  PriorityDesc = 'PRIORITY_DESC',
  Progress = 'PROGRESS',
  ProgressDesc = 'PROGRESS_DESC',
  ProgressVolumes = 'PROGRESS_VOLUMES',
  ProgressVolumesDesc = 'PROGRESS_VOLUMES_DESC',
  Repeat = 'REPEAT',
  RepeatDesc = 'REPEAT_DESC',
  Score = 'SCORE',
  ScoreDesc = 'SCORE_DESC',
  StartedOn = 'STARTED_ON',
  StartedOnDesc = 'STARTED_ON_DESC',
  Status = 'STATUS',
  StatusDesc = 'STATUS_DESC',
  UpdatedTime = 'UPDATED_TIME',
  UpdatedTimeDesc = 'UPDATED_TIME_DESC'
}

/** Media list watching/reading status enum. */
export enum MediaListStatus {
  /** Finished watching/reading */
  Completed = 'COMPLETED',
  /** Currently watching/reading */
  Current = 'CURRENT',
  /** Stopped watching/reading before completing */
  Dropped = 'DROPPED',
  /** Paused watching/reading */
  Paused = 'PAUSED',
  /** Planning to watch/read */
  Planning = 'PLANNING',
  /** Re-watching/reading */
  Repeating = 'REPEATING'
}

/** A user's list options for anime or manga lists */
export type MediaListTypeOptions = {
  __typename?: 'MediaListTypeOptions';
  /** The names of the user's advanced scoring sections */
  advancedScoring?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** If advanced scoring is enabled */
  advancedScoringEnabled?: Maybe<Scalars['Boolean']['output']>;
  /** The names of the user's custom lists */
  customLists?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The order each list should be displayed in */
  sectionOrder?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** If the completed sections of the list should be separated by format */
  splitCompletedSectionByFormat?: Maybe<Scalars['Boolean']['output']>;
  /**
   * The list theme options
   * @deprecated This field has not yet been fully implemented and may change without warning
   */
  theme?: Maybe<Scalars['Json']['output']>;
};

/** Notification for when a media entry is merged into another for a user who had it on their list */
export type MediaMergeNotification = {
  __typename?: 'MediaMergeNotification';
  /** The reason for the media data change */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The title of the deleted media */
  deletedMediaTitles?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The media that was merged into */
  media?: Maybe<Media>;
  /** The id of the media that was merged into */
  mediaId: Scalars['Int']['output'];
  /** The reason for the media merge */
  reason?: Maybe<Scalars['String']['output']>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
};

/** The ranking of a media in a particular time span and format compared to other media */
export type MediaRank = {
  __typename?: 'MediaRank';
  /** If the ranking is based on all time instead of a season/year */
  allTime?: Maybe<Scalars['Boolean']['output']>;
  /** String that gives context to the ranking type and time span */
  context: Scalars['String']['output'];
  /** The format the media is ranked within */
  format: MediaFormat;
  /** The id of the rank */
  id: Scalars['Int']['output'];
  /** The numerical rank of the media */
  rank: Scalars['Int']['output'];
  /** The season the media is ranked within */
  season?: Maybe<MediaSeason>;
  /** The type of ranking */
  type: MediaRankType;
  /** The year the media is ranked within */
  year?: Maybe<Scalars['Int']['output']>;
};

/** The type of ranking */
export enum MediaRankType {
  /** Ranking is based on the media's popularity */
  Popular = 'POPULAR',
  /** Ranking is based on the media's ratings/score */
  Rated = 'RATED'
}

/** Type of relation media has to its parent. */
export enum MediaRelation {
  /** An adaption of this media into a different format */
  Adaptation = 'ADAPTATION',
  /** An alternative version of the same media */
  Alternative = 'ALTERNATIVE',
  /** Shares at least 1 character */
  Character = 'CHARACTER',
  /** Version 2 only. */
  Compilation = 'COMPILATION',
  /** Version 2 only. */
  Contains = 'CONTAINS',
  /** Other */
  Other = 'OTHER',
  /** The media a side story is from */
  Parent = 'PARENT',
  /** Released before the relation */
  Prequel = 'PREQUEL',
  /** Released after the relation */
  Sequel = 'SEQUEL',
  /** A side story of the parent media */
  SideStory = 'SIDE_STORY',
  /** Version 2 only. The source material the media was adapted from */
  Source = 'SOURCE',
  /** An alternative version of the media with a different primary focus */
  SpinOff = 'SPIN_OFF',
  /** A shortened and summarized version */
  Summary = 'SUMMARY'
}

export enum MediaSeason {
  /** Months September to November */
  Fall = 'FALL',
  /** Months March to May */
  Spring = 'SPRING',
  /** Months June to August */
  Summer = 'SUMMER',
  /** Months December to February */
  Winter = 'WINTER'
}

/** Media sort enums */
export enum MediaSort {
  Chapters = 'CHAPTERS',
  ChaptersDesc = 'CHAPTERS_DESC',
  Duration = 'DURATION',
  DurationDesc = 'DURATION_DESC',
  EndDate = 'END_DATE',
  EndDateDesc = 'END_DATE_DESC',
  Episodes = 'EPISODES',
  EpisodesDesc = 'EPISODES_DESC',
  Favourites = 'FAVOURITES',
  FavouritesDesc = 'FAVOURITES_DESC',
  Format = 'FORMAT',
  FormatDesc = 'FORMAT_DESC',
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Popularity = 'POPULARITY',
  PopularityDesc = 'POPULARITY_DESC',
  Score = 'SCORE',
  ScoreDesc = 'SCORE_DESC',
  SearchMatch = 'SEARCH_MATCH',
  StartDate = 'START_DATE',
  StartDateDesc = 'START_DATE_DESC',
  Status = 'STATUS',
  StatusDesc = 'STATUS_DESC',
  TitleEnglish = 'TITLE_ENGLISH',
  TitleEnglishDesc = 'TITLE_ENGLISH_DESC',
  TitleNative = 'TITLE_NATIVE',
  TitleNativeDesc = 'TITLE_NATIVE_DESC',
  TitleRomaji = 'TITLE_ROMAJI',
  TitleRomajiDesc = 'TITLE_ROMAJI_DESC',
  Trending = 'TRENDING',
  TrendingDesc = 'TRENDING_DESC',
  Type = 'TYPE',
  TypeDesc = 'TYPE_DESC',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  Volumes = 'VOLUMES',
  VolumesDesc = 'VOLUMES_DESC'
}

/** Source type the media was adapted from */
export enum MediaSource {
  /** Version 2+ only. Japanese Anime */
  Anime = 'ANIME',
  /** Version 3 only. Comics excluding manga */
  Comic = 'COMIC',
  /** Version 2+ only. Self-published works */
  Doujinshi = 'DOUJINSHI',
  /** Version 3 only. Games excluding video games */
  Game = 'GAME',
  /** Written work published in volumes */
  LightNovel = 'LIGHT_NOVEL',
  /** Version 3 only. Live action media such as movies or TV show */
  LiveAction = 'LIVE_ACTION',
  /** Asian comic book */
  Manga = 'MANGA',
  /** Version 3 only. Multimedia project */
  MultimediaProject = 'MULTIMEDIA_PROJECT',
  /** Version 2+ only. Written works not published in volumes */
  Novel = 'NOVEL',
  /** An original production not based of another work */
  Original = 'ORIGINAL',
  /** Other */
  Other = 'OTHER',
  /** Version 3 only. Picture book */
  PictureBook = 'PICTURE_BOOK',
  /** Video game */
  VideoGame = 'VIDEO_GAME',
  /** Video game driven primary by text and narrative */
  VisualNovel = 'VISUAL_NOVEL',
  /** Version 3 only. Written works published online */
  WebNovel = 'WEB_NOVEL'
}

/** A media's statistics */
export type MediaStats = {
  __typename?: 'MediaStats';
  /** @deprecated Replaced by MediaTrends */
  airingProgression?: Maybe<Array<Maybe<AiringProgression>>>;
  scoreDistribution?: Maybe<Array<Maybe<ScoreDistribution>>>;
  statusDistribution?: Maybe<Array<Maybe<StatusDistribution>>>;
};

/** The current releasing status of the media */
export enum MediaStatus {
  /** Ended before the work could be finished */
  Cancelled = 'CANCELLED',
  /** Has completed and is no longer being released */
  Finished = 'FINISHED',
  /** Version 2 only. Is currently paused from releasing and will resume at a later date */
  Hiatus = 'HIATUS',
  /** To be released at a later date */
  NotYetReleased = 'NOT_YET_RELEASED',
  /** Currently releasing */
  Releasing = 'RELEASING'
}

/** Data and links to legal streaming episodes on external sites */
export type MediaStreamingEpisode = {
  __typename?: 'MediaStreamingEpisode';
  /** The site location of the streaming episodes */
  site?: Maybe<Scalars['String']['output']>;
  /** Url of episode image thumbnail */
  thumbnail?: Maybe<Scalars['String']['output']>;
  /** Title of the episode */
  title?: Maybe<Scalars['String']['output']>;
  /** The url of the episode */
  url?: Maybe<Scalars['String']['output']>;
};

/** Media submission */
export type MediaSubmission = {
  __typename?: 'MediaSubmission';
  /** Data Mod assigned to handle the submission */
  assignee?: Maybe<User>;
  changes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  characters?: Maybe<Array<Maybe<MediaSubmissionComparison>>>;
  createdAt?: Maybe<Scalars['Int']['output']>;
  externalLinks?: Maybe<Array<Maybe<MediaSubmissionComparison>>>;
  /** The id of the submission */
  id: Scalars['Int']['output'];
  /** Whether the submission is locked */
  locked?: Maybe<Scalars['Boolean']['output']>;
  media?: Maybe<Media>;
  notes?: Maybe<Scalars['String']['output']>;
  relations?: Maybe<Array<Maybe<MediaEdge>>>;
  source?: Maybe<Scalars['String']['output']>;
  staff?: Maybe<Array<Maybe<MediaSubmissionComparison>>>;
  /** Status of the submission */
  status?: Maybe<SubmissionStatus>;
  studios?: Maybe<Array<Maybe<MediaSubmissionComparison>>>;
  submission?: Maybe<Media>;
  /** User submitter of the submission */
  submitter?: Maybe<User>;
  submitterStats?: Maybe<Scalars['Json']['output']>;
};

/** Media submission with comparison to current data */
export type MediaSubmissionComparison = {
  __typename?: 'MediaSubmissionComparison';
  character?: Maybe<MediaCharacter>;
  externalLink?: Maybe<MediaExternalLink>;
  staff?: Maybe<StaffEdge>;
  studio?: Maybe<StudioEdge>;
  submission?: Maybe<MediaSubmissionEdge>;
};

export type MediaSubmissionEdge = {
  __typename?: 'MediaSubmissionEdge';
  character?: Maybe<Character>;
  characterName?: Maybe<Scalars['String']['output']>;
  characterRole?: Maybe<CharacterRole>;
  characterSubmission?: Maybe<Character>;
  dubGroup?: Maybe<Scalars['String']['output']>;
  externalLink?: Maybe<MediaExternalLink>;
  /** The id of the direct submission */
  id?: Maybe<Scalars['Int']['output']>;
  isMain?: Maybe<Scalars['Boolean']['output']>;
  media?: Maybe<Media>;
  roleNotes?: Maybe<Scalars['String']['output']>;
  staff?: Maybe<Staff>;
  staffRole?: Maybe<Scalars['String']['output']>;
  staffSubmission?: Maybe<Staff>;
  studio?: Maybe<Studio>;
  voiceActor?: Maybe<Staff>;
  voiceActorSubmission?: Maybe<Staff>;
};

/** A tag that describes a theme or element of the media */
export type MediaTag = {
  __typename?: 'MediaTag';
  /** The categories of tags this tag belongs to */
  category?: Maybe<Scalars['String']['output']>;
  /** A general description of the tag */
  description?: Maybe<Scalars['String']['output']>;
  /** The id of the tag */
  id: Scalars['Int']['output'];
  /** If the tag is only for adult 18+ media */
  isAdult?: Maybe<Scalars['Boolean']['output']>;
  /** If the tag could be a spoiler for any media */
  isGeneralSpoiler?: Maybe<Scalars['Boolean']['output']>;
  /** If the tag is a spoiler for this media */
  isMediaSpoiler?: Maybe<Scalars['Boolean']['output']>;
  /** The name of the tag */
  name: Scalars['String']['output'];
  /** The relevance ranking of the tag out of the 100 for this media */
  rank?: Maybe<Scalars['Int']['output']>;
  /** The user who submitted the tag */
  userId?: Maybe<Scalars['Int']['output']>;
};

/** The official titles of the media in various languages */
export type MediaTitle = {
  __typename?: 'MediaTitle';
  /** The official english title */
  english?: Maybe<Scalars['String']['output']>;
  /** Official title in it's native language */
  native?: Maybe<Scalars['String']['output']>;
  /** The romanization of the native language title */
  romaji?: Maybe<Scalars['String']['output']>;
  /** The currently authenticated users preferred title language. Default romaji for non-authenticated */
  userPreferred?: Maybe<Scalars['String']['output']>;
};


/** The official titles of the media in various languages */
export type MediaTitleEnglishArgs = {
  stylised?: InputMaybe<Scalars['Boolean']['input']>;
};


/** The official titles of the media in various languages */
export type MediaTitleNativeArgs = {
  stylised?: InputMaybe<Scalars['Boolean']['input']>;
};


/** The official titles of the media in various languages */
export type MediaTitleRomajiArgs = {
  stylised?: InputMaybe<Scalars['Boolean']['input']>;
};

/** The official titles of the media in various languages */
export type MediaTitleInput = {
  /** The official english title */
  english?: InputMaybe<Scalars['String']['input']>;
  /** Official title in it's native language */
  native?: InputMaybe<Scalars['String']['input']>;
  /** The romanization of the native language title */
  romaji?: InputMaybe<Scalars['String']['input']>;
};

/** Media trailer or advertisement */
export type MediaTrailer = {
  __typename?: 'MediaTrailer';
  /** The trailer video id */
  id?: Maybe<Scalars['String']['output']>;
  /** The site the video is hosted by (Currently either youtube or dailymotion) */
  site?: Maybe<Scalars['String']['output']>;
  /** The url for the thumbnail image of the video */
  thumbnail?: Maybe<Scalars['String']['output']>;
};

/** Daily media statistics */
export type MediaTrend = {
  __typename?: 'MediaTrend';
  /** A weighted average score of all the user's scores of the media */
  averageScore?: Maybe<Scalars['Int']['output']>;
  /** The day the data was recorded (timestamp) */
  date: Scalars['Int']['output'];
  /** The episode number of the anime released on this day */
  episode?: Maybe<Scalars['Int']['output']>;
  /** The number of users with watching/reading the media */
  inProgress?: Maybe<Scalars['Int']['output']>;
  /** The related media */
  media?: Maybe<Media>;
  /** The id of the tag */
  mediaId: Scalars['Int']['output'];
  /** The number of users with the media on their list */
  popularity?: Maybe<Scalars['Int']['output']>;
  /** If the media was being released at this time */
  releasing: Scalars['Boolean']['output'];
  /** The amount of media activity on the day */
  trending: Scalars['Int']['output'];
};

export type MediaTrendConnection = {
  __typename?: 'MediaTrendConnection';
  edges?: Maybe<Array<Maybe<MediaTrendEdge>>>;
  nodes?: Maybe<Array<Maybe<MediaTrend>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Media trend connection edge */
export type MediaTrendEdge = {
  __typename?: 'MediaTrendEdge';
  node?: Maybe<MediaTrend>;
};

/** Media trend sort enums */
export enum MediaTrendSort {
  Date = 'DATE',
  DateDesc = 'DATE_DESC',
  Episode = 'EPISODE',
  EpisodeDesc = 'EPISODE_DESC',
  Id = 'ID',
  IdDesc = 'ID_DESC',
  MediaId = 'MEDIA_ID',
  MediaIdDesc = 'MEDIA_ID_DESC',
  Popularity = 'POPULARITY',
  PopularityDesc = 'POPULARITY_DESC',
  Score = 'SCORE',
  ScoreDesc = 'SCORE_DESC',
  Trending = 'TRENDING',
  TrendingDesc = 'TRENDING_DESC'
}

/** Media type enum, anime or manga. */
export enum MediaType {
  /** Japanese Anime */
  Anime = 'ANIME',
  /** Asian comic */
  Manga = 'MANGA'
}

/** User message activity */
export type MessageActivity = {
  __typename?: 'MessageActivity';
  /** The time the activity was created at */
  createdAt: Scalars['Int']['output'];
  /** The id of the activity */
  id: Scalars['Int']['output'];
  /** If the currently authenticated user liked the activity */
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  /** If the activity is locked and can receive replies */
  isLocked?: Maybe<Scalars['Boolean']['output']>;
  /** If the message is private and only viewable to the sender and recipients */
  isPrivate?: Maybe<Scalars['Boolean']['output']>;
  /** If the currently authenticated user is subscribed to the activity */
  isSubscribed?: Maybe<Scalars['Boolean']['output']>;
  /** The amount of likes the activity has */
  likeCount: Scalars['Int']['output'];
  /** The users who liked the activity */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The message text (Markdown) */
  message?: Maybe<Scalars['String']['output']>;
  /** The user who sent the activity message */
  messenger?: Maybe<User>;
  /** The user id of the activity's sender */
  messengerId?: Maybe<Scalars['Int']['output']>;
  /** The user who the activity message was sent to */
  recipient?: Maybe<User>;
  /** The user id of the activity's recipient */
  recipientId?: Maybe<Scalars['Int']['output']>;
  /** The written replies to the activity */
  replies?: Maybe<Array<Maybe<ActivityReply>>>;
  /** The number of activity replies */
  replyCount: Scalars['Int']['output'];
  /** The url for the activity page on the AniList website */
  siteUrl?: Maybe<Scalars['String']['output']>;
  /** The type of the activity */
  type?: Maybe<ActivityType>;
};


/** User message activity */
export type MessageActivityMessageArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ModAction = {
  __typename?: 'ModAction';
  createdAt: Scalars['Int']['output'];
  data?: Maybe<Scalars['String']['output']>;
  /** The id of the action */
  id: Scalars['Int']['output'];
  mod?: Maybe<User>;
  objectId?: Maybe<Scalars['Int']['output']>;
  objectType?: Maybe<Scalars['String']['output']>;
  type?: Maybe<ModActionType>;
  user?: Maybe<User>;
};

export enum ModActionType {
  Anon = 'ANON',
  Ban = 'BAN',
  Delete = 'DELETE',
  Edit = 'EDIT',
  Expire = 'EXPIRE',
  Note = 'NOTE',
  Report = 'REPORT',
  Reset = 'RESET'
}

/** Mod role enums */
export enum ModRole {
  /** An AniList administrator */
  Admin = 'ADMIN',
  /** An anime data moderator */
  AnimeData = 'ANIME_DATA',
  /** A community moderator */
  Community = 'COMMUNITY',
  /** An AniList developer */
  Developer = 'DEVELOPER',
  /** A discord community moderator */
  DiscordCommunity = 'DISCORD_COMMUNITY',
  /** A lead anime data moderator */
  LeadAnimeData = 'LEAD_ANIME_DATA',
  /** A lead community moderator */
  LeadCommunity = 'LEAD_COMMUNITY',
  /** A head developer of AniList */
  LeadDeveloper = 'LEAD_DEVELOPER',
  /** A lead manga data moderator */
  LeadMangaData = 'LEAD_MANGA_DATA',
  /** A lead social media moderator */
  LeadSocialMedia = 'LEAD_SOCIAL_MEDIA',
  /** A manga data moderator */
  MangaData = 'MANGA_DATA',
  /** A retired moderator */
  Retired = 'RETIRED',
  /** A social media moderator */
  SocialMedia = 'SOCIAL_MEDIA'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Delete an activity item of the authenticated users */
  DeleteActivity?: Maybe<Deleted>;
  /** Delete an activity reply of the authenticated users */
  DeleteActivityReply?: Maybe<Deleted>;
  /** Delete a custom list and remove the list entries from it */
  DeleteCustomList?: Maybe<Deleted>;
  /** Delete a media list entry */
  DeleteMediaListEntry?: Maybe<Deleted>;
  /** Delete a review */
  DeleteReview?: Maybe<Deleted>;
  /** Delete a thread */
  DeleteThread?: Maybe<Deleted>;
  /** Delete a thread comment */
  DeleteThreadComment?: Maybe<Deleted>;
  /** Rate a review */
  RateReview?: Maybe<Review>;
  /** Create or update an activity reply */
  SaveActivityReply?: Maybe<ActivityReply>;
  /** Update list activity (Mod Only) */
  SaveListActivity?: Maybe<ListActivity>;
  /** Create or update a media list entry */
  SaveMediaListEntry?: Maybe<MediaList>;
  /** Create or update message activity for the currently authenticated user */
  SaveMessageActivity?: Maybe<MessageActivity>;
  /** Recommendation a media */
  SaveRecommendation?: Maybe<Recommendation>;
  /** Create or update a review */
  SaveReview?: Maybe<Review>;
  /** Create or update text activity for the currently authenticated user */
  SaveTextActivity?: Maybe<TextActivity>;
  /** Create or update a forum thread */
  SaveThread?: Maybe<Thread>;
  /** Create or update a thread comment */
  SaveThreadComment?: Maybe<ThreadComment>;
  /** Toggle activity to be pinned to the top of the user's activity feed */
  ToggleActivityPin?: Maybe<ActivityUnion>;
  /** Toggle the subscription of an activity item */
  ToggleActivitySubscription?: Maybe<ActivityUnion>;
  /** Favourite or unfavourite an anime, manga, character, staff member, or studio */
  ToggleFavourite?: Maybe<Favourites>;
  /** Toggle the un/following of a user */
  ToggleFollow?: Maybe<User>;
  /**
   * Add or remove a like from a likeable type.
   *                           Returns all the users who liked the same model
   */
  ToggleLike?: Maybe<Array<Maybe<User>>>;
  /** Add or remove a like from a likeable type. */
  ToggleLikeV2?: Maybe<LikeableUnion>;
  /** Toggle the subscription of a forum thread */
  ToggleThreadSubscription?: Maybe<Thread>;
  UpdateAniChartHighlights?: Maybe<Scalars['Json']['output']>;
  UpdateAniChartSettings?: Maybe<Scalars['Json']['output']>;
  /** Update the order favourites are displayed in */
  UpdateFavouriteOrder?: Maybe<Favourites>;
  /** Update multiple media list entries to the same values */
  UpdateMediaListEntries?: Maybe<Array<Maybe<MediaList>>>;
  UpdateUser?: Maybe<User>;
};


export type MutationDeleteActivityArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteActivityReplyArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteCustomListArgs = {
  customList?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<MediaType>;
};


export type MutationDeleteMediaListEntryArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteReviewArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteThreadArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteThreadCommentArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationRateReviewArgs = {
  rating?: InputMaybe<ReviewRating>;
  reviewId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationSaveActivityReplyArgs = {
  activityId?: InputMaybe<Scalars['Int']['input']>;
  asMod?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSaveListActivityArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  locked?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationSaveMediaListEntryArgs = {
  advancedScores?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  completedAt?: InputMaybe<FuzzyDateInput>;
  customLists?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hiddenFromStatusLists?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  private?: InputMaybe<Scalars['Boolean']['input']>;
  progress?: InputMaybe<Scalars['Int']['input']>;
  progressVolumes?: InputMaybe<Scalars['Int']['input']>;
  repeat?: InputMaybe<Scalars['Int']['input']>;
  score?: InputMaybe<Scalars['Float']['input']>;
  scoreRaw?: InputMaybe<Scalars['Int']['input']>;
  startedAt?: InputMaybe<FuzzyDateInput>;
  status?: InputMaybe<MediaListStatus>;
};


export type MutationSaveMessageActivityArgs = {
  asMod?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  locked?: InputMaybe<Scalars['Boolean']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  private?: InputMaybe<Scalars['Boolean']['input']>;
  recipientId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationSaveRecommendationArgs = {
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaRecommendationId?: InputMaybe<Scalars['Int']['input']>;
  rating?: InputMaybe<RecommendationRating>;
};


export type MutationSaveReviewArgs = {
  body?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  private?: InputMaybe<Scalars['Boolean']['input']>;
  score?: InputMaybe<Scalars['Int']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSaveTextActivityArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  locked?: InputMaybe<Scalars['Boolean']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSaveThreadArgs = {
  body?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  locked?: InputMaybe<Scalars['Boolean']['input']>;
  mediaCategories?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  sticky?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSaveThreadCommentArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  locked?: InputMaybe<Scalars['Boolean']['input']>;
  parentCommentId?: InputMaybe<Scalars['Int']['input']>;
  threadId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationToggleActivityPinArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationToggleActivitySubscriptionArgs = {
  activityId?: InputMaybe<Scalars['Int']['input']>;
  subscribe?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationToggleFavouriteArgs = {
  animeId?: InputMaybe<Scalars['Int']['input']>;
  characterId?: InputMaybe<Scalars['Int']['input']>;
  mangaId?: InputMaybe<Scalars['Int']['input']>;
  staffId?: InputMaybe<Scalars['Int']['input']>;
  studioId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationToggleFollowArgs = {
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationToggleLikeArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<LikeableType>;
};


export type MutationToggleLikeV2Args = {
  id?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<LikeableType>;
};


export type MutationToggleThreadSubscriptionArgs = {
  subscribe?: InputMaybe<Scalars['Boolean']['input']>;
  threadId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateAniChartHighlightsArgs = {
  highlights?: InputMaybe<Array<InputMaybe<AniChartHighlightInput>>>;
};


export type MutationUpdateAniChartSettingsArgs = {
  outgoingLinkProvider?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  theme?: InputMaybe<Scalars['String']['input']>;
  titleLanguage?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateFavouriteOrderArgs = {
  animeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  animeOrder?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  characterIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  characterOrder?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mangaIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mangaOrder?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  staffIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  staffOrder?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  studioIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  studioOrder?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};


export type MutationUpdateMediaListEntriesArgs = {
  advancedScores?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  completedAt?: InputMaybe<FuzzyDateInput>;
  hiddenFromStatusLists?: InputMaybe<Scalars['Boolean']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  private?: InputMaybe<Scalars['Boolean']['input']>;
  progress?: InputMaybe<Scalars['Int']['input']>;
  progressVolumes?: InputMaybe<Scalars['Int']['input']>;
  repeat?: InputMaybe<Scalars['Int']['input']>;
  score?: InputMaybe<Scalars['Float']['input']>;
  scoreRaw?: InputMaybe<Scalars['Int']['input']>;
  startedAt?: InputMaybe<FuzzyDateInput>;
  status?: InputMaybe<MediaListStatus>;
};


export type MutationUpdateUserArgs = {
  about?: InputMaybe<Scalars['String']['input']>;
  activityMergeTime?: InputMaybe<Scalars['Int']['input']>;
  airingNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  animeListOptions?: InputMaybe<MediaListOptionsInput>;
  disabledListActivity?: InputMaybe<Array<InputMaybe<ListActivityOptionInput>>>;
  displayAdultContent?: InputMaybe<Scalars['Boolean']['input']>;
  donatorBadge?: InputMaybe<Scalars['String']['input']>;
  mangaListOptions?: InputMaybe<MediaListOptionsInput>;
  notificationOptions?: InputMaybe<Array<InputMaybe<NotificationOptionInput>>>;
  profileColor?: InputMaybe<Scalars['String']['input']>;
  restrictMessagesToFollowing?: InputMaybe<Scalars['Boolean']['input']>;
  rowOrder?: InputMaybe<Scalars['String']['input']>;
  scoreFormat?: InputMaybe<ScoreFormat>;
  staffNameLanguage?: InputMaybe<UserStaffNameLanguage>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  titleLanguage?: InputMaybe<UserTitleLanguage>;
};

/** Notification option */
export type NotificationOption = {
  __typename?: 'NotificationOption';
  /** Whether this type of notification is enabled */
  enabled?: Maybe<Scalars['Boolean']['output']>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
};

/** Notification option input */
export type NotificationOptionInput = {
  /** Whether this type of notification is enabled */
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** The type of notification */
  type?: InputMaybe<NotificationType>;
};

/** Notification type enum */
export enum NotificationType {
  /** A user has liked your activity */
  ActivityLike = 'ACTIVITY_LIKE',
  /** A user has mentioned you in their activity */
  ActivityMention = 'ACTIVITY_MENTION',
  /** A user has sent you message */
  ActivityMessage = 'ACTIVITY_MESSAGE',
  /** A user has replied to your activity */
  ActivityReply = 'ACTIVITY_REPLY',
  /** A user has liked your activity reply */
  ActivityReplyLike = 'ACTIVITY_REPLY_LIKE',
  /** A user has replied to activity you have also replied to */
  ActivityReplySubscribed = 'ACTIVITY_REPLY_SUBSCRIBED',
  /** An anime you are currently watching has aired */
  Airing = 'AIRING',
  /** A user has followed you */
  Following = 'FOLLOWING',
  /** An anime or manga has had a data change that affects how a user may track it in their lists */
  MediaDataChange = 'MEDIA_DATA_CHANGE',
  /** An anime or manga on the user's list has been deleted from the site */
  MediaDeletion = 'MEDIA_DELETION',
  /** Anime or manga entries on the user's list have been merged into a single entry */
  MediaMerge = 'MEDIA_MERGE',
  /** A new anime or manga has been added to the site where its related media is on the user's list */
  RelatedMediaAddition = 'RELATED_MEDIA_ADDITION',
  /** A user has liked your forum comment */
  ThreadCommentLike = 'THREAD_COMMENT_LIKE',
  /** A user has mentioned you in a forum comment */
  ThreadCommentMention = 'THREAD_COMMENT_MENTION',
  /** A user has replied to your forum comment */
  ThreadCommentReply = 'THREAD_COMMENT_REPLY',
  /** A user has liked your forum thread */
  ThreadLike = 'THREAD_LIKE',
  /** A user has commented in one of your subscribed forum threads */
  ThreadSubscribed = 'THREAD_SUBSCRIBED'
}

/** Notification union type */
export type NotificationUnion = ActivityLikeNotification | ActivityMentionNotification | ActivityMessageNotification | ActivityReplyLikeNotification | ActivityReplyNotification | ActivityReplySubscribedNotification | AiringNotification | FollowingNotification | MediaDataChangeNotification | MediaDeletionNotification | MediaMergeNotification | RelatedMediaAdditionNotification | ThreadCommentLikeNotification | ThreadCommentMentionNotification | ThreadCommentReplyNotification | ThreadCommentSubscribedNotification | ThreadLikeNotification;

/** Page of data */
export type Page = {
  __typename?: 'Page';
  activities?: Maybe<Array<Maybe<ActivityUnion>>>;
  activityReplies?: Maybe<Array<Maybe<ActivityReply>>>;
  airingSchedules?: Maybe<Array<Maybe<AiringSchedule>>>;
  characters?: Maybe<Array<Maybe<Character>>>;
  followers?: Maybe<Array<Maybe<User>>>;
  following?: Maybe<Array<Maybe<User>>>;
  likes?: Maybe<Array<Maybe<User>>>;
  media?: Maybe<Array<Maybe<Media>>>;
  mediaList?: Maybe<Array<Maybe<MediaList>>>;
  mediaTrends?: Maybe<Array<Maybe<MediaTrend>>>;
  notifications?: Maybe<Array<Maybe<NotificationUnion>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
  recommendations?: Maybe<Array<Maybe<Recommendation>>>;
  reviews?: Maybe<Array<Maybe<Review>>>;
  staff?: Maybe<Array<Maybe<Staff>>>;
  studios?: Maybe<Array<Maybe<Studio>>>;
  threadComments?: Maybe<Array<Maybe<ThreadComment>>>;
  threads?: Maybe<Array<Maybe<Thread>>>;
  users?: Maybe<Array<Maybe<User>>>;
};


/** Page of data */
export type PageActivitiesArgs = {
  createdAt?: InputMaybe<Scalars['Int']['input']>;
  createdAt_greater?: InputMaybe<Scalars['Int']['input']>;
  createdAt_lesser?: InputMaybe<Scalars['Int']['input']>;
  hasReplies?: InputMaybe<Scalars['Boolean']['input']>;
  hasRepliesOrTypeText?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isFollowing?: InputMaybe<Scalars['Boolean']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']['input']>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  messengerId?: InputMaybe<Scalars['Int']['input']>;
  messengerId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  messengerId_not?: InputMaybe<Scalars['Int']['input']>;
  messengerId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  sort?: InputMaybe<Array<InputMaybe<ActivitySort>>>;
  type?: InputMaybe<ActivityType>;
  type_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  type_not?: InputMaybe<ActivityType>;
  type_not_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  userId?: InputMaybe<Scalars['Int']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  userId_not?: InputMaybe<Scalars['Int']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};


/** Page of data */
export type PageActivityRepliesArgs = {
  activityId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data */
export type PageAiringSchedulesArgs = {
  airingAt?: InputMaybe<Scalars['Int']['input']>;
  airingAt_greater?: InputMaybe<Scalars['Int']['input']>;
  airingAt_lesser?: InputMaybe<Scalars['Int']['input']>;
  episode?: InputMaybe<Scalars['Int']['input']>;
  episode_greater?: InputMaybe<Scalars['Int']['input']>;
  episode_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  episode_lesser?: InputMaybe<Scalars['Int']['input']>;
  episode_not?: InputMaybe<Scalars['Int']['input']>;
  episode_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']['input']>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notYetAired?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Array<InputMaybe<AiringSort>>>;
};


/** Page of data */
export type PageCharactersArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isBirthday?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
};


/** Page of data */
export type PageFollowersArgs = {
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  userId: Scalars['Int']['input'];
};


/** Page of data */
export type PageFollowingArgs = {
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  userId: Scalars['Int']['input'];
};


/** Page of data */
export type PageLikesArgs = {
  likeableId?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<LikeableType>;
};


/** Page of data */
export type PageMediaArgs = {
  averageScore?: InputMaybe<Scalars['Int']['input']>;
  averageScore_greater?: InputMaybe<Scalars['Int']['input']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']['input']>;
  averageScore_not?: InputMaybe<Scalars['Int']['input']>;
  chapters?: InputMaybe<Scalars['Int']['input']>;
  chapters_greater?: InputMaybe<Scalars['Int']['input']>;
  chapters_lesser?: InputMaybe<Scalars['Int']['input']>;
  countryOfOrigin?: InputMaybe<Scalars['CountryCode']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  duration_greater?: InputMaybe<Scalars['Int']['input']>;
  duration_lesser?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  endDate_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  endDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  endDate_like?: InputMaybe<Scalars['String']['input']>;
  episodes?: InputMaybe<Scalars['Int']['input']>;
  episodes_greater?: InputMaybe<Scalars['Int']['input']>;
  episodes_lesser?: InputMaybe<Scalars['Int']['input']>;
  format?: InputMaybe<MediaFormat>;
  format_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  format_not?: InputMaybe<MediaFormat>;
  format_not_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  genre?: InputMaybe<Scalars['String']['input']>;
  genre_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  genre_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  idMal?: InputMaybe<Scalars['Int']['input']>;
  idMal_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  idMal_not?: InputMaybe<Scalars['Int']['input']>;
  idMal_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isAdult?: InputMaybe<Scalars['Boolean']['input']>;
  isLicensed?: InputMaybe<Scalars['Boolean']['input']>;
  licensedBy?: InputMaybe<Scalars['String']['input']>;
  licensedById?: InputMaybe<Scalars['Int']['input']>;
  licensedById_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  licensedBy_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  minimumTagRank?: InputMaybe<Scalars['Int']['input']>;
  onList?: InputMaybe<Scalars['Boolean']['input']>;
  popularity?: InputMaybe<Scalars['Int']['input']>;
  popularity_greater?: InputMaybe<Scalars['Int']['input']>;
  popularity_lesser?: InputMaybe<Scalars['Int']['input']>;
  popularity_not?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  season?: InputMaybe<MediaSeason>;
  seasonYear?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  source?: InputMaybe<MediaSource>;
  source_in?: InputMaybe<Array<InputMaybe<MediaSource>>>;
  startDate?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startDate_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startDate_like?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MediaStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  status_not?: InputMaybe<MediaStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tagCategory?: InputMaybe<Scalars['String']['input']>;
  tagCategory_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tagCategory_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tag_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tag_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type?: InputMaybe<MediaType>;
  volumes?: InputMaybe<Scalars['Int']['input']>;
  volumes_greater?: InputMaybe<Scalars['Int']['input']>;
  volumes_lesser?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data */
export type PageMediaListArgs = {
  compareWithAuthList?: InputMaybe<Scalars['Boolean']['input']>;
  completedAt?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  completedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  completedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  completedAt_like?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isFollowing?: InputMaybe<Scalars['Boolean']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  notes_like?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaListSort>>>;
  startedAt?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startedAt_like?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MediaListStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not?: InputMaybe<MediaListStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  type?: InputMaybe<MediaType>;
  userId?: InputMaybe<Scalars['Int']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  userName?: InputMaybe<Scalars['String']['input']>;
};


/** Page of data */
export type PageMediaTrendsArgs = {
  averageScore?: InputMaybe<Scalars['Int']['input']>;
  averageScore_greater?: InputMaybe<Scalars['Int']['input']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']['input']>;
  averageScore_not?: InputMaybe<Scalars['Int']['input']>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_greater?: InputMaybe<Scalars['Int']['input']>;
  date_lesser?: InputMaybe<Scalars['Int']['input']>;
  episode?: InputMaybe<Scalars['Int']['input']>;
  episode_greater?: InputMaybe<Scalars['Int']['input']>;
  episode_lesser?: InputMaybe<Scalars['Int']['input']>;
  episode_not?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']['input']>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  popularity?: InputMaybe<Scalars['Int']['input']>;
  popularity_greater?: InputMaybe<Scalars['Int']['input']>;
  popularity_lesser?: InputMaybe<Scalars['Int']['input']>;
  popularity_not?: InputMaybe<Scalars['Int']['input']>;
  releasing?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaTrendSort>>>;
  trending?: InputMaybe<Scalars['Int']['input']>;
  trending_greater?: InputMaybe<Scalars['Int']['input']>;
  trending_lesser?: InputMaybe<Scalars['Int']['input']>;
  trending_not?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data */
export type PageNotificationsArgs = {
  resetNotificationCount?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<NotificationType>;
  type_in?: InputMaybe<Array<InputMaybe<NotificationType>>>;
};


/** Page of data */
export type PageRecommendationsArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaRecommendationId?: InputMaybe<Scalars['Int']['input']>;
  onList?: InputMaybe<Scalars['Boolean']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  rating_greater?: InputMaybe<Scalars['Int']['input']>;
  rating_lesser?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<RecommendationSort>>>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data */
export type PageReviewsArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaType?: InputMaybe<MediaType>;
  sort?: InputMaybe<Array<InputMaybe<ReviewSort>>>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data */
export type PageStaffArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isBirthday?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};


/** Page of data */
export type PageStudiosArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<StudioSort>>>;
};


/** Page of data */
export type PageThreadCommentsArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<ThreadCommentSort>>>;
  threadId?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data */
export type PageThreadsArgs = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaCategoryId?: InputMaybe<Scalars['Int']['input']>;
  replyUserId?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<ThreadSort>>>;
  subscribed?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** Page of data */
export type PageUsersArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  isModerator?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** The current page */
  currentPage?: Maybe<Scalars['Int']['output']>;
  /** If there is another page */
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  /** The last page */
  lastPage?: Maybe<Scalars['Int']['output']>;
  /** The count on a page */
  perPage?: Maybe<Scalars['Int']['output']>;
  /** The total number of items. Note: This value is not guaranteed to be accurate, do not rely on this for logic */
  total?: Maybe<Scalars['Int']['output']>;
};

/** Provides the parsed markdown as html */
export type ParsedMarkdown = {
  __typename?: 'ParsedMarkdown';
  /** The parsed markdown as html */
  html?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  /** Activity query */
  Activity?: Maybe<ActivityUnion>;
  /** Activity reply query */
  ActivityReply?: Maybe<ActivityReply>;
  /** Airing schedule query */
  AiringSchedule?: Maybe<AiringSchedule>;
  AniChartUser?: Maybe<AniChartUser>;
  /** Character query */
  Character?: Maybe<Character>;
  /** ExternalLinkSource collection query */
  ExternalLinkSourceCollection?: Maybe<Array<Maybe<MediaExternalLink>>>;
  /** Follow query */
  Follower?: Maybe<User>;
  /** Follow query */
  Following?: Maybe<User>;
  /** Collection of all the possible media genres */
  GenreCollection?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Like query */
  Like?: Maybe<User>;
  /** Provide AniList markdown to be converted to html (Requires auth) */
  Markdown?: Maybe<ParsedMarkdown>;
  /** Media query */
  Media?: Maybe<Media>;
  /** Media list query */
  MediaList?: Maybe<MediaList>;
  /** Media list collection query, provides list pre-grouped by status & custom lists. User ID and Media Type arguments required. */
  MediaListCollection?: Maybe<MediaListCollection>;
  /** Collection of all the possible media tags */
  MediaTagCollection?: Maybe<Array<Maybe<MediaTag>>>;
  /** Media Trend query */
  MediaTrend?: Maybe<MediaTrend>;
  /** Notification query */
  Notification?: Maybe<NotificationUnion>;
  Page?: Maybe<Page>;
  /** Recommendation query */
  Recommendation?: Maybe<Recommendation>;
  /** Review query */
  Review?: Maybe<Review>;
  /** Site statistics query */
  SiteStatistics?: Maybe<SiteStatistics>;
  /** Staff query */
  Staff?: Maybe<Staff>;
  /** Studio query */
  Studio?: Maybe<Studio>;
  /** Thread query */
  Thread?: Maybe<Thread>;
  /** Comment query */
  ThreadComment?: Maybe<Array<Maybe<ThreadComment>>>;
  /** User query */
  User?: Maybe<User>;
  /** Get the currently authenticated user */
  Viewer?: Maybe<User>;
};


export type QueryActivityArgs = {
  createdAt?: InputMaybe<Scalars['Int']['input']>;
  createdAt_greater?: InputMaybe<Scalars['Int']['input']>;
  createdAt_lesser?: InputMaybe<Scalars['Int']['input']>;
  hasReplies?: InputMaybe<Scalars['Boolean']['input']>;
  hasRepliesOrTypeText?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isFollowing?: InputMaybe<Scalars['Boolean']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']['input']>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  messengerId?: InputMaybe<Scalars['Int']['input']>;
  messengerId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  messengerId_not?: InputMaybe<Scalars['Int']['input']>;
  messengerId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  sort?: InputMaybe<Array<InputMaybe<ActivitySort>>>;
  type?: InputMaybe<ActivityType>;
  type_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  type_not?: InputMaybe<ActivityType>;
  type_not_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  userId?: InputMaybe<Scalars['Int']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  userId_not?: InputMaybe<Scalars['Int']['input']>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};


export type QueryActivityReplyArgs = {
  activityId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAiringScheduleArgs = {
  airingAt?: InputMaybe<Scalars['Int']['input']>;
  airingAt_greater?: InputMaybe<Scalars['Int']['input']>;
  airingAt_lesser?: InputMaybe<Scalars['Int']['input']>;
  episode?: InputMaybe<Scalars['Int']['input']>;
  episode_greater?: InputMaybe<Scalars['Int']['input']>;
  episode_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  episode_lesser?: InputMaybe<Scalars['Int']['input']>;
  episode_not?: InputMaybe<Scalars['Int']['input']>;
  episode_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']['input']>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notYetAired?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Array<InputMaybe<AiringSort>>>;
};


export type QueryCharacterArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isBirthday?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
};


export type QueryExternalLinkSourceCollectionArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  mediaType?: InputMaybe<ExternalLinkMediaType>;
  type?: InputMaybe<ExternalLinkType>;
};


export type QueryFollowerArgs = {
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  userId: Scalars['Int']['input'];
};


export type QueryFollowingArgs = {
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  userId: Scalars['Int']['input'];
};


export type QueryLikeArgs = {
  likeableId?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<LikeableType>;
};


export type QueryMarkdownArgs = {
  markdown: Scalars['String']['input'];
};


export type QueryMediaArgs = {
  averageScore?: InputMaybe<Scalars['Int']['input']>;
  averageScore_greater?: InputMaybe<Scalars['Int']['input']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']['input']>;
  averageScore_not?: InputMaybe<Scalars['Int']['input']>;
  chapters?: InputMaybe<Scalars['Int']['input']>;
  chapters_greater?: InputMaybe<Scalars['Int']['input']>;
  chapters_lesser?: InputMaybe<Scalars['Int']['input']>;
  countryOfOrigin?: InputMaybe<Scalars['CountryCode']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  duration_greater?: InputMaybe<Scalars['Int']['input']>;
  duration_lesser?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  endDate_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  endDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  endDate_like?: InputMaybe<Scalars['String']['input']>;
  episodes?: InputMaybe<Scalars['Int']['input']>;
  episodes_greater?: InputMaybe<Scalars['Int']['input']>;
  episodes_lesser?: InputMaybe<Scalars['Int']['input']>;
  format?: InputMaybe<MediaFormat>;
  format_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  format_not?: InputMaybe<MediaFormat>;
  format_not_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  genre?: InputMaybe<Scalars['String']['input']>;
  genre_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  genre_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  idMal?: InputMaybe<Scalars['Int']['input']>;
  idMal_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  idMal_not?: InputMaybe<Scalars['Int']['input']>;
  idMal_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isAdult?: InputMaybe<Scalars['Boolean']['input']>;
  isLicensed?: InputMaybe<Scalars['Boolean']['input']>;
  licensedBy?: InputMaybe<Scalars['String']['input']>;
  licensedById?: InputMaybe<Scalars['Int']['input']>;
  licensedById_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  licensedBy_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  minimumTagRank?: InputMaybe<Scalars['Int']['input']>;
  onList?: InputMaybe<Scalars['Boolean']['input']>;
  popularity?: InputMaybe<Scalars['Int']['input']>;
  popularity_greater?: InputMaybe<Scalars['Int']['input']>;
  popularity_lesser?: InputMaybe<Scalars['Int']['input']>;
  popularity_not?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  season?: InputMaybe<MediaSeason>;
  seasonYear?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  source?: InputMaybe<MediaSource>;
  source_in?: InputMaybe<Array<InputMaybe<MediaSource>>>;
  startDate?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startDate_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startDate_like?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MediaStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  status_not?: InputMaybe<MediaStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tagCategory?: InputMaybe<Scalars['String']['input']>;
  tagCategory_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tagCategory_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tag_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tag_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type?: InputMaybe<MediaType>;
  volumes?: InputMaybe<Scalars['Int']['input']>;
  volumes_greater?: InputMaybe<Scalars['Int']['input']>;
  volumes_lesser?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMediaListArgs = {
  compareWithAuthList?: InputMaybe<Scalars['Boolean']['input']>;
  completedAt?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  completedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  completedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  completedAt_like?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isFollowing?: InputMaybe<Scalars['Boolean']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  notes_like?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaListSort>>>;
  startedAt?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startedAt_like?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MediaListStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not?: InputMaybe<MediaListStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  type?: InputMaybe<MediaType>;
  userId?: InputMaybe<Scalars['Int']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  userName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMediaListCollectionArgs = {
  chunk?: InputMaybe<Scalars['Int']['input']>;
  completedAt?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  completedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  completedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  completedAt_like?: InputMaybe<Scalars['String']['input']>;
  forceSingleCompletedList?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  notes_like?: InputMaybe<Scalars['String']['input']>;
  perChunk?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaListSort>>>;
  startedAt?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startedAt_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startedAt_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startedAt_like?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MediaListStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not?: InputMaybe<MediaListStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  type?: InputMaybe<MediaType>;
  userId?: InputMaybe<Scalars['Int']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMediaTagCollectionArgs = {
  status?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMediaTrendArgs = {
  averageScore?: InputMaybe<Scalars['Int']['input']>;
  averageScore_greater?: InputMaybe<Scalars['Int']['input']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']['input']>;
  averageScore_not?: InputMaybe<Scalars['Int']['input']>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_greater?: InputMaybe<Scalars['Int']['input']>;
  date_lesser?: InputMaybe<Scalars['Int']['input']>;
  episode?: InputMaybe<Scalars['Int']['input']>;
  episode_greater?: InputMaybe<Scalars['Int']['input']>;
  episode_lesser?: InputMaybe<Scalars['Int']['input']>;
  episode_not?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaId_not?: InputMaybe<Scalars['Int']['input']>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  popularity?: InputMaybe<Scalars['Int']['input']>;
  popularity_greater?: InputMaybe<Scalars['Int']['input']>;
  popularity_lesser?: InputMaybe<Scalars['Int']['input']>;
  popularity_not?: InputMaybe<Scalars['Int']['input']>;
  releasing?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaTrendSort>>>;
  trending?: InputMaybe<Scalars['Int']['input']>;
  trending_greater?: InputMaybe<Scalars['Int']['input']>;
  trending_lesser?: InputMaybe<Scalars['Int']['input']>;
  trending_not?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNotificationArgs = {
  resetNotificationCount?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<NotificationType>;
  type_in?: InputMaybe<Array<InputMaybe<NotificationType>>>;
};


export type QueryPageArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRecommendationArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaRecommendationId?: InputMaybe<Scalars['Int']['input']>;
  onList?: InputMaybe<Scalars['Boolean']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  rating_greater?: InputMaybe<Scalars['Int']['input']>;
  rating_lesser?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<RecommendationSort>>>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryReviewArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  mediaType?: InputMaybe<MediaType>;
  sort?: InputMaybe<Array<InputMaybe<ReviewSort>>>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStaffArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isBirthday?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
};


export type QueryStudioArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<StudioSort>>>;
};


export type QueryThreadArgs = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mediaCategoryId?: InputMaybe<Scalars['Int']['input']>;
  replyUserId?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<ThreadSort>>>;
  subscribed?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryThreadCommentArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<ThreadCommentSort>>>;
  threadId?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  isModerator?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
};

/** Media recommendation */
export type Recommendation = {
  __typename?: 'Recommendation';
  /** The id of the recommendation */
  id: Scalars['Int']['output'];
  /** The media the recommendation is from */
  media?: Maybe<Media>;
  /** The recommended media */
  mediaRecommendation?: Maybe<Media>;
  /** Users rating of the recommendation */
  rating?: Maybe<Scalars['Int']['output']>;
  /** The user that first created the recommendation */
  user?: Maybe<User>;
  /** The rating of the recommendation by currently authenticated user */
  userRating?: Maybe<RecommendationRating>;
};

export type RecommendationConnection = {
  __typename?: 'RecommendationConnection';
  edges?: Maybe<Array<Maybe<RecommendationEdge>>>;
  nodes?: Maybe<Array<Maybe<Recommendation>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Recommendation connection edge */
export type RecommendationEdge = {
  __typename?: 'RecommendationEdge';
  node?: Maybe<Recommendation>;
};

/** Recommendation rating enums */
export enum RecommendationRating {
  NoRating = 'NO_RATING',
  RateDown = 'RATE_DOWN',
  RateUp = 'RATE_UP'
}

/** Recommendation sort enums */
export enum RecommendationSort {
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Rating = 'RATING',
  RatingDesc = 'RATING_DESC'
}

/** Notification for when new media is added to the site */
export type RelatedMediaAdditionNotification = {
  __typename?: 'RelatedMediaAdditionNotification';
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The associated media of the airing schedule */
  media?: Maybe<Media>;
  /** The id of the new media */
  mediaId: Scalars['Int']['output'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
};

export type Report = {
  __typename?: 'Report';
  cleared?: Maybe<Scalars['Boolean']['output']>;
  /** When the entry data was created */
  createdAt?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  reported?: Maybe<User>;
  reporter?: Maybe<User>;
};

/** A Review that features in an anime or manga */
export type Review = {
  __typename?: 'Review';
  /** The main review body text */
  body?: Maybe<Scalars['String']['output']>;
  /** The time of the thread creation */
  createdAt: Scalars['Int']['output'];
  /** The id of the review */
  id: Scalars['Int']['output'];
  /** The media the review is of */
  media?: Maybe<Media>;
  /** The id of the review's media */
  mediaId: Scalars['Int']['output'];
  /** For which type of media the review is for */
  mediaType?: Maybe<MediaType>;
  /** If the review is not yet publicly published and is only viewable by creator */
  private?: Maybe<Scalars['Boolean']['output']>;
  /** The total user rating of the review */
  rating?: Maybe<Scalars['Int']['output']>;
  /** The amount of user ratings of the review */
  ratingAmount?: Maybe<Scalars['Int']['output']>;
  /** The review score of the media */
  score?: Maybe<Scalars['Int']['output']>;
  /** The url for the review page on the AniList website */
  siteUrl?: Maybe<Scalars['String']['output']>;
  /** A short summary of the review */
  summary?: Maybe<Scalars['String']['output']>;
  /** The time of the thread last update */
  updatedAt: Scalars['Int']['output'];
  /** The creator of the review */
  user?: Maybe<User>;
  /** The id of the review's creator */
  userId: Scalars['Int']['output'];
  /** The rating of the review by currently authenticated user */
  userRating?: Maybe<ReviewRating>;
};


/** A Review that features in an anime or manga */
export type ReviewBodyArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ReviewConnection = {
  __typename?: 'ReviewConnection';
  edges?: Maybe<Array<Maybe<ReviewEdge>>>;
  nodes?: Maybe<Array<Maybe<Review>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Review connection edge */
export type ReviewEdge = {
  __typename?: 'ReviewEdge';
  node?: Maybe<Review>;
};

/** Review rating enums */
export enum ReviewRating {
  DownVote = 'DOWN_VOTE',
  NoVote = 'NO_VOTE',
  UpVote = 'UP_VOTE'
}

/** Review sort enums */
export enum ReviewSort {
  CreatedAt = 'CREATED_AT',
  CreatedAtDesc = 'CREATED_AT_DESC',
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Rating = 'RATING',
  RatingDesc = 'RATING_DESC',
  Score = 'SCORE',
  ScoreDesc = 'SCORE_DESC',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/** Feed of mod edit activity */
export type RevisionHistory = {
  __typename?: 'RevisionHistory';
  /** The action taken on the objects */
  action?: Maybe<RevisionHistoryAction>;
  /** A JSON object of the fields that changed */
  changes?: Maybe<Scalars['Json']['output']>;
  /** The character the mod feed entry references */
  character?: Maybe<Character>;
  /** When the mod feed entry was created */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The external link source the mod feed entry references */
  externalLink?: Maybe<MediaExternalLink>;
  /** The id of the media */
  id: Scalars['Int']['output'];
  /** The media the mod feed entry references */
  media?: Maybe<Media>;
  /** The staff member the mod feed entry references */
  staff?: Maybe<Staff>;
  /** The studio the mod feed entry references */
  studio?: Maybe<Studio>;
  /** The user who made the edit to the object */
  user?: Maybe<User>;
};

/** Revision history actions */
export enum RevisionHistoryAction {
  Create = 'CREATE',
  Edit = 'EDIT'
}

/** A user's list score distribution. */
export type ScoreDistribution = {
  __typename?: 'ScoreDistribution';
  /** The amount of list entries with this score */
  amount?: Maybe<Scalars['Int']['output']>;
  score?: Maybe<Scalars['Int']['output']>;
};

/** Media list scoring type */
export enum ScoreFormat {
  /** An integer from 0-3. Should be represented in Smileys. 0 => No Score, 1 => :(, 2 => :|, 3 => :) */
  Point_3 = 'POINT_3',
  /** An integer from 0-5. Should be represented in Stars */
  Point_5 = 'POINT_5',
  /** An integer from 0-10 */
  Point_10 = 'POINT_10',
  /** A float from 0-10 with 1 decimal place */
  Point_10Decimal = 'POINT_10_DECIMAL',
  /** An integer from 0-100 */
  Point_100 = 'POINT_100'
}

export type SiteStatistics = {
  __typename?: 'SiteStatistics';
  anime?: Maybe<SiteTrendConnection>;
  characters?: Maybe<SiteTrendConnection>;
  manga?: Maybe<SiteTrendConnection>;
  reviews?: Maybe<SiteTrendConnection>;
  staff?: Maybe<SiteTrendConnection>;
  studios?: Maybe<SiteTrendConnection>;
  users?: Maybe<SiteTrendConnection>;
};


export type SiteStatisticsAnimeArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
};


export type SiteStatisticsCharactersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
};


export type SiteStatisticsMangaArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
};


export type SiteStatisticsReviewsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
};


export type SiteStatisticsStaffArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
};


export type SiteStatisticsStudiosArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
};


export type SiteStatisticsUsersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
};

/** Daily site statistics */
export type SiteTrend = {
  __typename?: 'SiteTrend';
  /** The change from yesterday */
  change: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  /** The day the data was recorded (timestamp) */
  date: Scalars['Int']['output'];
};

export type SiteTrendConnection = {
  __typename?: 'SiteTrendConnection';
  edges?: Maybe<Array<Maybe<SiteTrendEdge>>>;
  nodes?: Maybe<Array<Maybe<SiteTrend>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Site trend connection edge */
export type SiteTrendEdge = {
  __typename?: 'SiteTrendEdge';
  node?: Maybe<SiteTrend>;
};

/** Site trend sort enums */
export enum SiteTrendSort {
  Change = 'CHANGE',
  ChangeDesc = 'CHANGE_DESC',
  Count = 'COUNT',
  CountDesc = 'COUNT_DESC',
  Date = 'DATE',
  DateDesc = 'DATE_DESC'
}

/** Voice actors or production staff */
export type Staff = {
  __typename?: 'Staff';
  /** The person's age in years */
  age?: Maybe<Scalars['Int']['output']>;
  /** The persons blood type */
  bloodType?: Maybe<Scalars['String']['output']>;
  /** Media the actor voiced characters in. (Same data as characters with media as node instead of characters) */
  characterMedia?: Maybe<MediaConnection>;
  /** Characters voiced by the actor */
  characters?: Maybe<CharacterConnection>;
  dateOfBirth?: Maybe<FuzzyDate>;
  dateOfDeath?: Maybe<FuzzyDate>;
  /** A general description of the staff member */
  description?: Maybe<Scalars['String']['output']>;
  /** The amount of user's who have favourited the staff member */
  favourites?: Maybe<Scalars['Int']['output']>;
  /** The staff's gender. Usually Male, Female, or Non-binary but can be any string. */
  gender?: Maybe<Scalars['String']['output']>;
  /** The persons birthplace or hometown */
  homeTown?: Maybe<Scalars['String']['output']>;
  /** The id of the staff member */
  id: Scalars['Int']['output'];
  /** The staff images */
  image?: Maybe<StaffImage>;
  /** If the staff member is marked as favourite by the currently authenticated user */
  isFavourite: Scalars['Boolean']['output'];
  /** If the staff member is blocked from being added to favourites */
  isFavouriteBlocked: Scalars['Boolean']['output'];
  /**
   * The primary language the staff member dub's in
   * @deprecated Replaced with languageV2
   */
  language?: Maybe<StaffLanguage>;
  /** The primary language of the staff member. Current values: Japanese, English, Korean, Italian, Spanish, Portuguese, French, German, Hebrew, Hungarian, Chinese, Arabic, Filipino, Catalan, Finnish, Turkish, Dutch, Swedish, Thai, Tagalog, Malaysian, Indonesian, Vietnamese, Nepali, Hindi, Urdu */
  languageV2?: Maybe<Scalars['String']['output']>;
  /** Notes for site moderators */
  modNotes?: Maybe<Scalars['String']['output']>;
  /** The names of the staff member */
  name?: Maybe<StaffName>;
  /** The person's primary occupations */
  primaryOccupations?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The url for the staff page on the AniList website */
  siteUrl?: Maybe<Scalars['String']['output']>;
  /** Staff member that the submission is referencing */
  staff?: Maybe<Staff>;
  /** Media where the staff member has a production role */
  staffMedia?: Maybe<MediaConnection>;
  /** Inner details of submission status */
  submissionNotes?: Maybe<Scalars['String']['output']>;
  /** Status of the submission */
  submissionStatus?: Maybe<Scalars['Int']['output']>;
  /** Submitter for the submission */
  submitter?: Maybe<User>;
  /** @deprecated No data available */
  updatedAt?: Maybe<Scalars['Int']['output']>;
  /** [startYear, endYear] (If the 2nd value is not present staff is still active) */
  yearsActive?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
};


/** Voice actors or production staff */
export type StaffCharacterMediaArgs = {
  onList?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
};


/** Voice actors or production staff */
export type StaffCharactersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
};


/** Voice actors or production staff */
export type StaffDescriptionArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Voice actors or production staff */
export type StaffStaffMediaArgs = {
  onList?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  type?: InputMaybe<MediaType>;
};

export type StaffConnection = {
  __typename?: 'StaffConnection';
  edges?: Maybe<Array<Maybe<StaffEdge>>>;
  nodes?: Maybe<Array<Maybe<Staff>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Staff connection edge */
export type StaffEdge = {
  __typename?: 'StaffEdge';
  /** The order the staff should be displayed from the users favourites */
  favouriteOrder?: Maybe<Scalars['Int']['output']>;
  /** The id of the connection */
  id?: Maybe<Scalars['Int']['output']>;
  node?: Maybe<Staff>;
  /** The role of the staff member in the production of the media */
  role?: Maybe<Scalars['String']['output']>;
};

export type StaffImage = {
  __typename?: 'StaffImage';
  /** The person's image of media at its largest size */
  large?: Maybe<Scalars['String']['output']>;
  /** The person's image of media at medium size */
  medium?: Maybe<Scalars['String']['output']>;
};

/** The primary language of the voice actor */
export enum StaffLanguage {
  /** English */
  English = 'ENGLISH',
  /** French */
  French = 'FRENCH',
  /** German */
  German = 'GERMAN',
  /** Hebrew */
  Hebrew = 'HEBREW',
  /** Hungarian */
  Hungarian = 'HUNGARIAN',
  /** Italian */
  Italian = 'ITALIAN',
  /** Japanese */
  Japanese = 'JAPANESE',
  /** Korean */
  Korean = 'KOREAN',
  /** Portuguese */
  Portuguese = 'PORTUGUESE',
  /** Spanish */
  Spanish = 'SPANISH'
}

/** The names of the staff member */
export type StaffName = {
  __typename?: 'StaffName';
  /** Other names the staff member might be referred to as (pen names) */
  alternative?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The person's given name */
  first?: Maybe<Scalars['String']['output']>;
  /** The person's first and last name */
  full?: Maybe<Scalars['String']['output']>;
  /** The person's surname */
  last?: Maybe<Scalars['String']['output']>;
  /** The person's middle name */
  middle?: Maybe<Scalars['String']['output']>;
  /** The person's full name in their native language */
  native?: Maybe<Scalars['String']['output']>;
  /** The currently authenticated users preferred name language. Default romaji for non-authenticated */
  userPreferred?: Maybe<Scalars['String']['output']>;
};

/** The names of the staff member */
export type StaffNameInput = {
  /** Other names the character might be referred by */
  alternative?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The person's given name */
  first?: InputMaybe<Scalars['String']['input']>;
  /** The person's surname */
  last?: InputMaybe<Scalars['String']['input']>;
  /** The person's middle name */
  middle?: InputMaybe<Scalars['String']['input']>;
  /** The person's full name in their native language */
  native?: InputMaybe<Scalars['String']['input']>;
};

/** Voice actor role for a character */
export type StaffRoleType = {
  __typename?: 'StaffRoleType';
  /** Used for grouping roles where multiple dubs exist for the same language. Either dubbing company name or language variant. */
  dubGroup?: Maybe<Scalars['String']['output']>;
  /** Notes regarding the VA's role for the character */
  roleNotes?: Maybe<Scalars['String']['output']>;
  /** The voice actors of the character */
  voiceActor?: Maybe<Staff>;
};

/** Staff sort enums */
export enum StaffSort {
  Favourites = 'FAVOURITES',
  FavouritesDesc = 'FAVOURITES_DESC',
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Language = 'LANGUAGE',
  LanguageDesc = 'LANGUAGE_DESC',
  /** Order manually decided by moderators */
  Relevance = 'RELEVANCE',
  Role = 'ROLE',
  RoleDesc = 'ROLE_DESC',
  SearchMatch = 'SEARCH_MATCH'
}

/** User's staff statistics */
export type StaffStats = {
  __typename?: 'StaffStats';
  amount?: Maybe<Scalars['Int']['output']>;
  meanScore?: Maybe<Scalars['Int']['output']>;
  staff?: Maybe<Staff>;
  /** The amount of time in minutes the staff member has been watched by the user */
  timeWatched?: Maybe<Scalars['Int']['output']>;
};

/** A submission for a staff that features in an anime or manga */
export type StaffSubmission = {
  __typename?: 'StaffSubmission';
  /** Data Mod assigned to handle the submission */
  assignee?: Maybe<User>;
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the submission */
  id: Scalars['Int']['output'];
  /** Whether the submission is locked */
  locked?: Maybe<Scalars['Boolean']['output']>;
  /** Inner details of submission status */
  notes?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  /** Staff that the submission is referencing */
  staff?: Maybe<Staff>;
  /** Status of the submission */
  status?: Maybe<SubmissionStatus>;
  /** The staff submission changes */
  submission?: Maybe<Staff>;
  /** Submitter for the submission */
  submitter?: Maybe<User>;
};

/** The distribution of the watching/reading status of media or a user's list */
export type StatusDistribution = {
  __typename?: 'StatusDistribution';
  /** The amount of entries with this status */
  amount?: Maybe<Scalars['Int']['output']>;
  /** The day the activity took place (Unix timestamp) */
  status?: Maybe<MediaListStatus>;
};

/** Animation or production company */
export type Studio = {
  __typename?: 'Studio';
  /** The amount of user's who have favourited the studio */
  favourites?: Maybe<Scalars['Int']['output']>;
  /** The id of the studio */
  id: Scalars['Int']['output'];
  /** If the studio is an animation studio or a different kind of company */
  isAnimationStudio: Scalars['Boolean']['output'];
  /** If the studio is marked as favourite by the currently authenticated user */
  isFavourite: Scalars['Boolean']['output'];
  /** The media the studio has worked on */
  media?: Maybe<MediaConnection>;
  /** The name of the studio */
  name: Scalars['String']['output'];
  /** The url for the studio page on the AniList website */
  siteUrl?: Maybe<Scalars['String']['output']>;
};


/** Animation or production company */
export type StudioMediaArgs = {
  isMain?: InputMaybe<Scalars['Boolean']['input']>;
  onList?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
};

export type StudioConnection = {
  __typename?: 'StudioConnection';
  edges?: Maybe<Array<Maybe<StudioEdge>>>;
  nodes?: Maybe<Array<Maybe<Studio>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

/** Studio connection edge */
export type StudioEdge = {
  __typename?: 'StudioEdge';
  /** The order the character should be displayed from the users favourites */
  favouriteOrder?: Maybe<Scalars['Int']['output']>;
  /** The id of the connection */
  id?: Maybe<Scalars['Int']['output']>;
  /** If the studio is the main animation studio of the anime */
  isMain: Scalars['Boolean']['output'];
  node?: Maybe<Studio>;
};

/** Studio sort enums */
export enum StudioSort {
  Favourites = 'FAVOURITES',
  FavouritesDesc = 'FAVOURITES_DESC',
  Id = 'ID',
  IdDesc = 'ID_DESC',
  Name = 'NAME',
  NameDesc = 'NAME_DESC',
  SearchMatch = 'SEARCH_MATCH'
}

/** User's studio statistics */
export type StudioStats = {
  __typename?: 'StudioStats';
  amount?: Maybe<Scalars['Int']['output']>;
  meanScore?: Maybe<Scalars['Int']['output']>;
  studio?: Maybe<Studio>;
  /** The amount of time in minutes the studio's works have been watched by the user */
  timeWatched?: Maybe<Scalars['Int']['output']>;
};

/** Submission sort enums */
export enum SubmissionSort {
  Id = 'ID',
  IdDesc = 'ID_DESC'
}

/** Submission status */
export enum SubmissionStatus {
  Accepted = 'ACCEPTED',
  PartiallyAccepted = 'PARTIALLY_ACCEPTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

/** User's tag statistics */
export type TagStats = {
  __typename?: 'TagStats';
  amount?: Maybe<Scalars['Int']['output']>;
  meanScore?: Maybe<Scalars['Int']['output']>;
  tag?: Maybe<MediaTag>;
  /** The amount of time in minutes the tag has been watched by the user */
  timeWatched?: Maybe<Scalars['Int']['output']>;
};

/** User text activity */
export type TextActivity = {
  __typename?: 'TextActivity';
  /** The time the activity was created at */
  createdAt: Scalars['Int']['output'];
  /** The id of the activity */
  id: Scalars['Int']['output'];
  /** If the currently authenticated user liked the activity */
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  /** If the activity is locked and can receive replies */
  isLocked?: Maybe<Scalars['Boolean']['output']>;
  /** If the activity is pinned to the top of the users activity feed */
  isPinned?: Maybe<Scalars['Boolean']['output']>;
  /** If the currently authenticated user is subscribed to the activity */
  isSubscribed?: Maybe<Scalars['Boolean']['output']>;
  /** The amount of likes the activity has */
  likeCount: Scalars['Int']['output'];
  /** The users who liked the activity */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The written replies to the activity */
  replies?: Maybe<Array<Maybe<ActivityReply>>>;
  /** The number of activity replies */
  replyCount: Scalars['Int']['output'];
  /** The url for the activity page on the AniList website */
  siteUrl?: Maybe<Scalars['String']['output']>;
  /** The status text (Markdown) */
  text?: Maybe<Scalars['String']['output']>;
  /** The type of activity */
  type?: Maybe<ActivityType>;
  /** The user who created the activity */
  user?: Maybe<User>;
  /** The user id of the activity's creator */
  userId?: Maybe<Scalars['Int']['output']>;
};


/** User text activity */
export type TextActivityTextArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Forum Thread */
export type Thread = {
  __typename?: 'Thread';
  /** The text body of the thread (Markdown) */
  body?: Maybe<Scalars['String']['output']>;
  /** The categories of the thread */
  categories?: Maybe<Array<Maybe<ThreadCategory>>>;
  /** The time of the thread creation */
  createdAt: Scalars['Int']['output'];
  /** The id of the thread */
  id: Scalars['Int']['output'];
  /** If the currently authenticated user liked the thread */
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  /** If the thread is locked and can receive comments */
  isLocked?: Maybe<Scalars['Boolean']['output']>;
  /** If the thread is stickied and should be displayed at the top of the page */
  isSticky?: Maybe<Scalars['Boolean']['output']>;
  /** If the currently authenticated user is subscribed to the thread */
  isSubscribed?: Maybe<Scalars['Boolean']['output']>;
  /** The amount of likes the thread has */
  likeCount: Scalars['Int']['output'];
  /** The users who liked the thread */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The media categories of the thread */
  mediaCategories?: Maybe<Array<Maybe<Media>>>;
  /** The time of the last reply */
  repliedAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the most recent comment on the thread */
  replyCommentId?: Maybe<Scalars['Int']['output']>;
  /** The number of comments on the thread */
  replyCount?: Maybe<Scalars['Int']['output']>;
  /** The user to last reply to the thread */
  replyUser?: Maybe<User>;
  /** The id of the user who most recently commented on the thread */
  replyUserId?: Maybe<Scalars['Int']['output']>;
  /** The url for the thread page on the AniList website */
  siteUrl?: Maybe<Scalars['String']['output']>;
  /** The title of the thread */
  title?: Maybe<Scalars['String']['output']>;
  /** The time of the thread last update */
  updatedAt: Scalars['Int']['output'];
  /** The owner of the thread */
  user?: Maybe<User>;
  /** The id of the thread owner user */
  userId: Scalars['Int']['output'];
  /** The number of times users have viewed the thread */
  viewCount?: Maybe<Scalars['Int']['output']>;
};


/** Forum Thread */
export type ThreadBodyArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A forum thread category */
export type ThreadCategory = {
  __typename?: 'ThreadCategory';
  /** The id of the category */
  id: Scalars['Int']['output'];
  /** The name of the category */
  name: Scalars['String']['output'];
};

/** Forum Thread Comment */
export type ThreadComment = {
  __typename?: 'ThreadComment';
  /** The comment's child reply comments */
  childComments?: Maybe<Scalars['Json']['output']>;
  /** The text content of the comment (Markdown) */
  comment?: Maybe<Scalars['String']['output']>;
  /** The time of the comments creation */
  createdAt: Scalars['Int']['output'];
  /** The id of the comment */
  id: Scalars['Int']['output'];
  /** If the currently authenticated user liked the comment */
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  /** If the comment tree is locked and may not receive replies or edits */
  isLocked?: Maybe<Scalars['Boolean']['output']>;
  /** The amount of likes the comment has */
  likeCount: Scalars['Int']['output'];
  /** The users who liked the comment */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The url for the comment page on the AniList website */
  siteUrl?: Maybe<Scalars['String']['output']>;
  /** The thread the comment belongs to */
  thread?: Maybe<Thread>;
  /** The id of thread the comment belongs to */
  threadId?: Maybe<Scalars['Int']['output']>;
  /** The time of the comments last update */
  updatedAt: Scalars['Int']['output'];
  /** The user who created the comment */
  user?: Maybe<User>;
  /** The user id of the comment's owner */
  userId?: Maybe<Scalars['Int']['output']>;
};


/** Forum Thread Comment */
export type ThreadCommentCommentArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Notification for when a thread comment is liked */
export type ThreadCommentLikeNotification = {
  __typename?: 'ThreadCommentLikeNotification';
  /** The thread comment that was liked */
  comment?: Maybe<ThreadComment>;
  /** The id of the activity which was liked */
  commentId: Scalars['Int']['output'];
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who liked the activity */
  user?: Maybe<User>;
  /** The id of the user who liked to the activity */
  userId: Scalars['Int']['output'];
};

/** Notification for when authenticated user is @ mentioned in a forum thread comment */
export type ThreadCommentMentionNotification = {
  __typename?: 'ThreadCommentMentionNotification';
  /** The thread comment that included the @ mention */
  comment?: Maybe<ThreadComment>;
  /** The id of the comment where mentioned */
  commentId: Scalars['Int']['output'];
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who mentioned the authenticated user */
  user?: Maybe<User>;
  /** The id of the user who mentioned the authenticated user */
  userId: Scalars['Int']['output'];
};

/** Notification for when a user replies to your forum thread comment */
export type ThreadCommentReplyNotification = {
  __typename?: 'ThreadCommentReplyNotification';
  /** The reply thread comment */
  comment?: Maybe<ThreadComment>;
  /** The id of the reply comment */
  commentId: Scalars['Int']['output'];
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who replied to the activity */
  user?: Maybe<User>;
  /** The id of the user who create the comment reply */
  userId: Scalars['Int']['output'];
};

/** Thread comments sort enums */
export enum ThreadCommentSort {
  Id = 'ID',
  IdDesc = 'ID_DESC'
}

/** Notification for when a user replies to a subscribed forum thread */
export type ThreadCommentSubscribedNotification = {
  __typename?: 'ThreadCommentSubscribedNotification';
  /** The reply thread comment */
  comment?: Maybe<ThreadComment>;
  /** The id of the new comment in the subscribed thread */
  commentId: Scalars['Int']['output'];
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who replied to the subscribed thread */
  user?: Maybe<User>;
  /** The id of the user who commented on the thread */
  userId: Scalars['Int']['output'];
};

/** Notification for when a thread is liked */
export type ThreadLikeNotification = {
  __typename?: 'ThreadLikeNotification';
  /** The liked thread comment */
  comment?: Maybe<ThreadComment>;
  /** The notification context text */
  context?: Maybe<Scalars['String']['output']>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** The id of the Notification */
  id: Scalars['Int']['output'];
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The id of the thread which was liked */
  threadId: Scalars['Int']['output'];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who liked the activity */
  user?: Maybe<User>;
  /** The id of the user who liked to the activity */
  userId: Scalars['Int']['output'];
};

/** Thread sort enums */
export enum ThreadSort {
  CreatedAt = 'CREATED_AT',
  CreatedAtDesc = 'CREATED_AT_DESC',
  Id = 'ID',
  IdDesc = 'ID_DESC',
  IsSticky = 'IS_STICKY',
  RepliedAt = 'REPLIED_AT',
  RepliedAtDesc = 'REPLIED_AT_DESC',
  ReplyCount = 'REPLY_COUNT',
  ReplyCountDesc = 'REPLY_COUNT_DESC',
  SearchMatch = 'SEARCH_MATCH',
  Title = 'TITLE',
  TitleDesc = 'TITLE_DESC',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  ViewCount = 'VIEW_COUNT',
  ViewCountDesc = 'VIEW_COUNT_DESC'
}

/** A user */
export type User = {
  __typename?: 'User';
  /** The bio written by user (Markdown) */
  about?: Maybe<Scalars['String']['output']>;
  /** The user's avatar images */
  avatar?: Maybe<UserAvatar>;
  /** The user's banner images */
  bannerImage?: Maybe<Scalars['String']['output']>;
  bans?: Maybe<Scalars['Json']['output']>;
  /** When the user's account was created. (Does not exist for accounts created before 2020) */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** Custom donation badge text */
  donatorBadge?: Maybe<Scalars['String']['output']>;
  /** The donation tier of the user */
  donatorTier?: Maybe<Scalars['Int']['output']>;
  /** The users favourites */
  favourites?: Maybe<Favourites>;
  /** The id of the user */
  id: Scalars['Int']['output'];
  /** If the user is blocked by the authenticated user */
  isBlocked?: Maybe<Scalars['Boolean']['output']>;
  /** If this user if following the authenticated user */
  isFollower?: Maybe<Scalars['Boolean']['output']>;
  /** If the authenticated user if following this user */
  isFollowing?: Maybe<Scalars['Boolean']['output']>;
  /** The user's media list options */
  mediaListOptions?: Maybe<MediaListOptions>;
  /** The user's moderator roles if they are a site moderator */
  moderatorRoles?: Maybe<Array<Maybe<ModRole>>>;
  /**
   * If the user is a moderator or data moderator
   * @deprecated Deprecated. Replaced with moderatorRoles field.
   */
  moderatorStatus?: Maybe<Scalars['String']['output']>;
  /** The name of the user */
  name: Scalars['String']['output'];
  /** The user's general options */
  options?: Maybe<UserOptions>;
  /** The user's previously used names. */
  previousNames?: Maybe<Array<Maybe<UserPreviousName>>>;
  /** The url for the user page on the AniList website */
  siteUrl?: Maybe<Scalars['String']['output']>;
  /** The users anime & manga list statistics */
  statistics?: Maybe<UserStatisticTypes>;
  /**
   * The user's statistics
   * @deprecated Deprecated. Replaced with statistics field.
   */
  stats?: Maybe<UserStats>;
  /** The number of unread notifications the user has */
  unreadNotificationCount?: Maybe<Scalars['Int']['output']>;
  /** When the user's data was last updated */
  updatedAt?: Maybe<Scalars['Int']['output']>;
};


/** A user */
export type UserAboutArgs = {
  asHtml?: InputMaybe<Scalars['Boolean']['input']>;
};


/** A user */
export type UserFavouritesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** A user's activity history stats. */
export type UserActivityHistory = {
  __typename?: 'UserActivityHistory';
  /** The amount of activity on the day */
  amount?: Maybe<Scalars['Int']['output']>;
  /** The day the activity took place (Unix timestamp) */
  date?: Maybe<Scalars['Int']['output']>;
  /** The level of activity represented on a 1-10 scale */
  level?: Maybe<Scalars['Int']['output']>;
};

/** A user's avatars */
export type UserAvatar = {
  __typename?: 'UserAvatar';
  /** The avatar of user at its largest size */
  large?: Maybe<Scalars['String']['output']>;
  /** The avatar of user at medium size */
  medium?: Maybe<Scalars['String']['output']>;
};

export type UserCountryStatistic = {
  __typename?: 'UserCountryStatistic';
  chaptersRead: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  country?: Maybe<Scalars['CountryCode']['output']>;
  meanScore: Scalars['Float']['output'];
  mediaIds: Array<Maybe<Scalars['Int']['output']>>;
  minutesWatched: Scalars['Int']['output'];
};

export type UserFormatStatistic = {
  __typename?: 'UserFormatStatistic';
  chaptersRead: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  format?: Maybe<MediaFormat>;
  meanScore: Scalars['Float']['output'];
  mediaIds: Array<Maybe<Scalars['Int']['output']>>;
  minutesWatched: Scalars['Int']['output'];
};

export type UserGenreStatistic = {
  __typename?: 'UserGenreStatistic';
  chaptersRead: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  genre?: Maybe<Scalars['String']['output']>;
  meanScore: Scalars['Float']['output'];
  mediaIds: Array<Maybe<Scalars['Int']['output']>>;
  minutesWatched: Scalars['Int']['output'];
};

export type UserLengthStatistic = {
  __typename?: 'UserLengthStatistic';
  chaptersRead: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  length?: Maybe<Scalars['String']['output']>;
  meanScore: Scalars['Float']['output'];
  mediaIds: Array<Maybe<Scalars['Int']['output']>>;
  minutesWatched: Scalars['Int']['output'];
};

/** User data for moderators */
export type UserModData = {
  __typename?: 'UserModData';
  alts?: Maybe<Array<Maybe<User>>>;
  bans?: Maybe<Scalars['Json']['output']>;
  counts?: Maybe<Scalars['Json']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  ip?: Maybe<Scalars['Json']['output']>;
  privacy?: Maybe<Scalars['Int']['output']>;
};

/** A user's general options */
export type UserOptions = {
  __typename?: 'UserOptions';
  /** Minutes between activity for them to be merged together. 0 is Never, Above 2 weeks (20160 mins) is Always. */
  activityMergeTime?: Maybe<Scalars['Int']['output']>;
  /** Whether the user receives notifications when a show they are watching aires */
  airingNotifications?: Maybe<Scalars['Boolean']['output']>;
  /** The list activity types the user has disabled from being created from list updates */
  disabledListActivity?: Maybe<Array<Maybe<ListActivityOption>>>;
  /** Whether the user has enabled viewing of 18+ content */
  displayAdultContent?: Maybe<Scalars['Boolean']['output']>;
  /** Notification options */
  notificationOptions?: Maybe<Array<Maybe<NotificationOption>>>;
  /** Profile highlight color (blue, purple, pink, orange, red, green, gray) */
  profileColor?: Maybe<Scalars['String']['output']>;
  /** Whether the user only allow messages from users they follow */
  restrictMessagesToFollowing?: Maybe<Scalars['Boolean']['output']>;
  /** The language the user wants to see staff and character names in */
  staffNameLanguage?: Maybe<UserStaffNameLanguage>;
  /** The user's timezone offset (Auth user only) */
  timezone?: Maybe<Scalars['String']['output']>;
  /** The language the user wants to see media titles in */
  titleLanguage?: Maybe<UserTitleLanguage>;
};

/** A user's previous name */
export type UserPreviousName = {
  __typename?: 'UserPreviousName';
  /** When the user first changed from this name. */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /** A previous name of the user. */
  name?: Maybe<Scalars['String']['output']>;
  /** When the user most recently changed from this name. */
  updatedAt?: Maybe<Scalars['Int']['output']>;
};

export type UserReleaseYearStatistic = {
  __typename?: 'UserReleaseYearStatistic';
  chaptersRead: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  meanScore: Scalars['Float']['output'];
  mediaIds: Array<Maybe<Scalars['Int']['output']>>;
  minutesWatched: Scalars['Int']['output'];
  releaseYear?: Maybe<Scalars['Int']['output']>;
};

export type UserScoreStatistic = {
  __typename?: 'UserScoreStatistic';
  chaptersRead: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  meanScore: Scalars['Float']['output'];
  mediaIds: Array<Maybe<Scalars['Int']['output']>>;
  minutesWatched: Scalars['Int']['output'];
  score?: Maybe<Scalars['Int']['output']>;
};

/** User sort enums */
export enum UserSort {
  ChaptersRead = 'CHAPTERS_READ',
  ChaptersReadDesc = 'CHAPTERS_READ_DESC',
  Id = 'ID',
  IdDesc = 'ID_DESC',
  SearchMatch = 'SEARCH_MATCH',
  Username = 'USERNAME',
  UsernameDesc = 'USERNAME_DESC',
  WatchedTime = 'WATCHED_TIME',
  WatchedTimeDesc = 'WATCHED_TIME_DESC'
}

/** The language the user wants to see staff and character names in */
export enum UserStaffNameLanguage {
  /** The staff or character's name in their native language */
  Native = 'NATIVE',
  /** The romanization of the staff or character's native name */
  Romaji = 'ROMAJI',
  /** The romanization of the staff or character's native name, with western name ordering */
  RomajiWestern = 'ROMAJI_WESTERN'
}

export type UserStaffStatistic = {
  __typename?: 'UserStaffStatistic';
  chaptersRead: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  meanScore: Scalars['Float']['output'];
  mediaIds: Array<Maybe<Scalars['Int']['output']>>;
  minutesWatched: Scalars['Int']['output'];
  staff?: Maybe<Staff>;
};

export type UserStartYearStatistic = {
  __typename?: 'UserStartYearStatistic';
  chaptersRead: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  meanScore: Scalars['Float']['output'];
  mediaIds: Array<Maybe<Scalars['Int']['output']>>;
  minutesWatched: Scalars['Int']['output'];
  startYear?: Maybe<Scalars['Int']['output']>;
};

export type UserStatisticTypes = {
  __typename?: 'UserStatisticTypes';
  anime?: Maybe<UserStatistics>;
  manga?: Maybe<UserStatistics>;
};

export type UserStatistics = {
  __typename?: 'UserStatistics';
  chaptersRead: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  countries?: Maybe<Array<Maybe<UserCountryStatistic>>>;
  episodesWatched: Scalars['Int']['output'];
  formats?: Maybe<Array<Maybe<UserFormatStatistic>>>;
  genres?: Maybe<Array<Maybe<UserGenreStatistic>>>;
  lengths?: Maybe<Array<Maybe<UserLengthStatistic>>>;
  meanScore: Scalars['Float']['output'];
  minutesWatched: Scalars['Int']['output'];
  releaseYears?: Maybe<Array<Maybe<UserReleaseYearStatistic>>>;
  scores?: Maybe<Array<Maybe<UserScoreStatistic>>>;
  staff?: Maybe<Array<Maybe<UserStaffStatistic>>>;
  standardDeviation: Scalars['Float']['output'];
  startYears?: Maybe<Array<Maybe<UserStartYearStatistic>>>;
  statuses?: Maybe<Array<Maybe<UserStatusStatistic>>>;
  studios?: Maybe<Array<Maybe<UserStudioStatistic>>>;
  tags?: Maybe<Array<Maybe<UserTagStatistic>>>;
  voiceActors?: Maybe<Array<Maybe<UserVoiceActorStatistic>>>;
  volumesRead: Scalars['Int']['output'];
};


export type UserStatisticsCountriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};


export type UserStatisticsFormatsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};


export type UserStatisticsGenresArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};


export type UserStatisticsLengthsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};


export type UserStatisticsReleaseYearsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};


export type UserStatisticsScoresArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};


export type UserStatisticsStaffArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};


export type UserStatisticsStartYearsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};


export type UserStatisticsStatusesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};


export type UserStatisticsStudiosArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};


export type UserStatisticsTagsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};


export type UserStatisticsVoiceActorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
};

/** User statistics sort enum */
export enum UserStatisticsSort {
  Count = 'COUNT',
  CountDesc = 'COUNT_DESC',
  Id = 'ID',
  IdDesc = 'ID_DESC',
  MeanScore = 'MEAN_SCORE',
  MeanScoreDesc = 'MEAN_SCORE_DESC',
  Progress = 'PROGRESS',
  ProgressDesc = 'PROGRESS_DESC'
}

/** A user's statistics */
export type UserStats = {
  __typename?: 'UserStats';
  activityHistory?: Maybe<Array<Maybe<UserActivityHistory>>>;
  animeListScores?: Maybe<ListScoreStats>;
  animeScoreDistribution?: Maybe<Array<Maybe<ScoreDistribution>>>;
  animeStatusDistribution?: Maybe<Array<Maybe<StatusDistribution>>>;
  /** The amount of manga chapters the user has read */
  chaptersRead?: Maybe<Scalars['Int']['output']>;
  favouredActors?: Maybe<Array<Maybe<StaffStats>>>;
  favouredFormats?: Maybe<Array<Maybe<FormatStats>>>;
  favouredGenres?: Maybe<Array<Maybe<GenreStats>>>;
  favouredGenresOverview?: Maybe<Array<Maybe<GenreStats>>>;
  favouredStaff?: Maybe<Array<Maybe<StaffStats>>>;
  favouredStudios?: Maybe<Array<Maybe<StudioStats>>>;
  favouredTags?: Maybe<Array<Maybe<TagStats>>>;
  favouredYears?: Maybe<Array<Maybe<YearStats>>>;
  mangaListScores?: Maybe<ListScoreStats>;
  mangaScoreDistribution?: Maybe<Array<Maybe<ScoreDistribution>>>;
  mangaStatusDistribution?: Maybe<Array<Maybe<StatusDistribution>>>;
  /** The amount of anime the user has watched in minutes */
  watchedTime?: Maybe<Scalars['Int']['output']>;
};

export type UserStatusStatistic = {
  __typename?: 'UserStatusStatistic';
  chaptersRead: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  meanScore: Scalars['Float']['output'];
  mediaIds: Array<Maybe<Scalars['Int']['output']>>;
  minutesWatched: Scalars['Int']['output'];
  status?: Maybe<MediaListStatus>;
};

export type UserStudioStatistic = {
  __typename?: 'UserStudioStatistic';
  chaptersRead: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  meanScore: Scalars['Float']['output'];
  mediaIds: Array<Maybe<Scalars['Int']['output']>>;
  minutesWatched: Scalars['Int']['output'];
  studio?: Maybe<Studio>;
};

export type UserTagStatistic = {
  __typename?: 'UserTagStatistic';
  chaptersRead: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  meanScore: Scalars['Float']['output'];
  mediaIds: Array<Maybe<Scalars['Int']['output']>>;
  minutesWatched: Scalars['Int']['output'];
  tag?: Maybe<MediaTag>;
};

/** The language the user wants to see media titles in */
export enum UserTitleLanguage {
  /** The official english title */
  English = 'ENGLISH',
  /** The official english title, stylised by media creator */
  EnglishStylised = 'ENGLISH_STYLISED',
  /** Official title in it's native language */
  Native = 'NATIVE',
  /** Official title in it's native language, stylised by media creator */
  NativeStylised = 'NATIVE_STYLISED',
  /** The romanization of the native language title */
  Romaji = 'ROMAJI',
  /** The romanization of the native language title, stylised by media creator */
  RomajiStylised = 'ROMAJI_STYLISED'
}

export type UserVoiceActorStatistic = {
  __typename?: 'UserVoiceActorStatistic';
  chaptersRead: Scalars['Int']['output'];
  characterIds: Array<Maybe<Scalars['Int']['output']>>;
  count: Scalars['Int']['output'];
  meanScore: Scalars['Float']['output'];
  mediaIds: Array<Maybe<Scalars['Int']['output']>>;
  minutesWatched: Scalars['Int']['output'];
  voiceActor?: Maybe<Staff>;
};

/** User's year statistics */
export type YearStats = {
  __typename?: 'YearStats';
  amount?: Maybe<Scalars['Int']['output']>;
  meanScore?: Maybe<Scalars['Int']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type Cache_Updates_Mutation_ToggleFavouriteFragment = { __typename?: 'Media', id: number, isFavourite: boolean } & { ' $fragmentName'?: 'Cache_Updates_Mutation_ToggleFavouriteFragment' };

export type TypelistQueryQueryVariables = Exact<{
  userName: Scalars['String']['input'];
  type: MediaType;
  chunk?: InputMaybe<Scalars['Int']['input']>;
  perChunk?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TypelistQueryQuery = { __typename?: 'Query', MediaListCollection?: { __typename?: 'MediaListCollection', lists?: Array<(
      { __typename?: 'MediaListGroup', name?: string | null }
      & { ' $fragmentRefs'?: { 'List_MediaListGroupFragment': List_MediaListGroupFragment } }
    ) | null> | null } | null };

export type List_MediaListGroupFragment = { __typename?: 'MediaListGroup', name?: string | null, entries?: Array<{ __typename?: 'MediaList', id: number, media?: { __typename?: 'Media', id: number, coverImage?: { __typename?: 'MediaCoverImage', extraLarge?: string | null, medium?: string | null } | null, title?: { __typename?: 'MediaTitle', userPreferred?: string | null } | null } | null } | null> | null } & { ' $fragmentName'?: 'List_MediaListGroupFragment' };

export type HomeQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type HomeQueryQuery = { __typename?: 'Query', Media?: { __typename?: 'Media', id: number, isFavourite: boolean, title?: { __typename?: 'MediaTitle', userPreferred?: string | null } | null } | null };

export type HomeMutationMutationVariables = Exact<{
  animeId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type HomeMutationMutation = { __typename?: 'Mutation', ToggleFavourite?: { __typename: 'Favourites' } | null };

export const Cache_Updates_Mutation_ToggleFavouriteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"cache_updates_Mutation_ToggleFavourite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Media"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isFavourite"}}]}}]} as unknown as DocumentNode<Cache_Updates_Mutation_ToggleFavouriteFragment, unknown>;
export const List_MediaListGroupFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"List_mediaListGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaListGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"coverImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"extraLarge"}},{"kind":"Field","name":{"kind":"Name","value":"medium"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userPreferred"}}]}}]}}]}}]}}]} as unknown as DocumentNode<List_MediaListGroupFragment, unknown>;
export const TypelistQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TypelistQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MediaType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chunk"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"perChunk"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"MediaListCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userName"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"chunk"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chunk"}}},{"kind":"Argument","name":{"kind":"Name","value":"perChunk"},"value":{"kind":"Variable","name":{"kind":"Name","value":"perChunk"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"List_mediaListGroup"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"List_mediaListGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MediaListGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"coverImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"extraLarge"}},{"kind":"Field","name":{"kind":"Name","value":"medium"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userPreferred"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TypelistQueryQuery, TypelistQueryQueryVariables>;
export const HomeQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HomeQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Media"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userPreferred"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isFavourite"}}]}}]}}]} as unknown as DocumentNode<HomeQueryQuery, HomeQueryQueryVariables>;
export const HomeMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"HomeMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"animeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ToggleFavourite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"animeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"animeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<HomeMutationMutation, HomeMutationMutationVariables>;
export type WithTypename<T extends { __typename?: any }> = Partial<T> & { __typename: NonNullable<T['__typename']> };

export type GraphCacheKeysConfig = {
  ActivityLikeNotification?: (data: WithTypename<ActivityLikeNotification>) => null | string,
  ActivityMentionNotification?: (data: WithTypename<ActivityMentionNotification>) => null | string,
  ActivityMessageNotification?: (data: WithTypename<ActivityMessageNotification>) => null | string,
  ActivityReply?: (data: WithTypename<ActivityReply>) => null | string,
  ActivityReplyLikeNotification?: (data: WithTypename<ActivityReplyLikeNotification>) => null | string,
  ActivityReplyNotification?: (data: WithTypename<ActivityReplyNotification>) => null | string,
  ActivityReplySubscribedNotification?: (data: WithTypename<ActivityReplySubscribedNotification>) => null | string,
  AiringNotification?: (data: WithTypename<AiringNotification>) => null | string,
  AiringProgression?: (data: WithTypename<AiringProgression>) => null | string,
  AiringSchedule?: (data: WithTypename<AiringSchedule>) => null | string,
  AiringScheduleConnection?: (data: WithTypename<AiringScheduleConnection>) => null | string,
  AiringScheduleEdge?: (data: WithTypename<AiringScheduleEdge>) => null | string,
  AniChartUser?: (data: WithTypename<AniChartUser>) => null | string,
  Character?: (data: WithTypename<Character>) => null | string,
  CharacterConnection?: (data: WithTypename<CharacterConnection>) => null | string,
  CharacterEdge?: (data: WithTypename<CharacterEdge>) => null | string,
  CharacterImage?: (data: WithTypename<CharacterImage>) => null | string,
  CharacterName?: (data: WithTypename<CharacterName>) => null | string,
  CharacterSubmission?: (data: WithTypename<CharacterSubmission>) => null | string,
  CharacterSubmissionConnection?: (data: WithTypename<CharacterSubmissionConnection>) => null | string,
  CharacterSubmissionEdge?: (data: WithTypename<CharacterSubmissionEdge>) => null | string,
  Deleted?: (data: WithTypename<Deleted>) => null | string,
  Favourites?: (data: WithTypename<Favourites>) => null | string,
  FollowingNotification?: (data: WithTypename<FollowingNotification>) => null | string,
  FormatStats?: (data: WithTypename<FormatStats>) => null | string,
  FuzzyDate?: (data: WithTypename<FuzzyDate>) => null | string,
  GenreStats?: (data: WithTypename<GenreStats>) => null | string,
  InternalPage?: (data: WithTypename<InternalPage>) => null | string,
  ListActivity?: (data: WithTypename<ListActivity>) => null | string,
  ListActivityOption?: (data: WithTypename<ListActivityOption>) => null | string,
  ListScoreStats?: (data: WithTypename<ListScoreStats>) => null | string,
  Media?: (data: WithTypename<Media>) => null | string,
  MediaCharacter?: (data: WithTypename<MediaCharacter>) => null | string,
  MediaConnection?: (data: WithTypename<MediaConnection>) => null | string,
  MediaCoverImage?: (data: WithTypename<MediaCoverImage>) => null | string,
  MediaDataChangeNotification?: (data: WithTypename<MediaDataChangeNotification>) => null | string,
  MediaDeletionNotification?: (data: WithTypename<MediaDeletionNotification>) => null | string,
  MediaEdge?: (data: WithTypename<MediaEdge>) => null | string,
  MediaExternalLink?: (data: WithTypename<MediaExternalLink>) => null | string,
  MediaList?: (data: WithTypename<MediaList>) => null | string,
  MediaListCollection?: (data: WithTypename<MediaListCollection>) => null | string,
  MediaListGroup?: (data: WithTypename<MediaListGroup>) => null | string,
  MediaListOptions?: (data: WithTypename<MediaListOptions>) => null | string,
  MediaListTypeOptions?: (data: WithTypename<MediaListTypeOptions>) => null | string,
  MediaMergeNotification?: (data: WithTypename<MediaMergeNotification>) => null | string,
  MediaRank?: (data: WithTypename<MediaRank>) => null | string,
  MediaStats?: (data: WithTypename<MediaStats>) => null | string,
  MediaStreamingEpisode?: (data: WithTypename<MediaStreamingEpisode>) => null | string,
  MediaSubmission?: (data: WithTypename<MediaSubmission>) => null | string,
  MediaSubmissionComparison?: (data: WithTypename<MediaSubmissionComparison>) => null | string,
  MediaSubmissionEdge?: (data: WithTypename<MediaSubmissionEdge>) => null | string,
  MediaTag?: (data: WithTypename<MediaTag>) => null | string,
  MediaTitle?: (data: WithTypename<MediaTitle>) => null | string,
  MediaTrailer?: (data: WithTypename<MediaTrailer>) => null | string,
  MediaTrend?: (data: WithTypename<MediaTrend>) => null | string,
  MediaTrendConnection?: (data: WithTypename<MediaTrendConnection>) => null | string,
  MediaTrendEdge?: (data: WithTypename<MediaTrendEdge>) => null | string,
  MessageActivity?: (data: WithTypename<MessageActivity>) => null | string,
  ModAction?: (data: WithTypename<ModAction>) => null | string,
  NotificationOption?: (data: WithTypename<NotificationOption>) => null | string,
  Page?: (data: WithTypename<Page>) => null | string,
  PageInfo?: (data: WithTypename<PageInfo>) => null | string,
  ParsedMarkdown?: (data: WithTypename<ParsedMarkdown>) => null | string,
  Recommendation?: (data: WithTypename<Recommendation>) => null | string,
  RecommendationConnection?: (data: WithTypename<RecommendationConnection>) => null | string,
  RecommendationEdge?: (data: WithTypename<RecommendationEdge>) => null | string,
  RelatedMediaAdditionNotification?: (data: WithTypename<RelatedMediaAdditionNotification>) => null | string,
  Report?: (data: WithTypename<Report>) => null | string,
  Review?: (data: WithTypename<Review>) => null | string,
  ReviewConnection?: (data: WithTypename<ReviewConnection>) => null | string,
  ReviewEdge?: (data: WithTypename<ReviewEdge>) => null | string,
  RevisionHistory?: (data: WithTypename<RevisionHistory>) => null | string,
  ScoreDistribution?: (data: WithTypename<ScoreDistribution>) => null | string,
  SiteStatistics?: (data: WithTypename<SiteStatistics>) => null | string,
  SiteTrend?: (data: WithTypename<SiteTrend>) => null | string,
  SiteTrendConnection?: (data: WithTypename<SiteTrendConnection>) => null | string,
  SiteTrendEdge?: (data: WithTypename<SiteTrendEdge>) => null | string,
  Staff?: (data: WithTypename<Staff>) => null | string,
  StaffConnection?: (data: WithTypename<StaffConnection>) => null | string,
  StaffEdge?: (data: WithTypename<StaffEdge>) => null | string,
  StaffImage?: (data: WithTypename<StaffImage>) => null | string,
  StaffName?: (data: WithTypename<StaffName>) => null | string,
  StaffRoleType?: (data: WithTypename<StaffRoleType>) => null | string,
  StaffStats?: (data: WithTypename<StaffStats>) => null | string,
  StaffSubmission?: (data: WithTypename<StaffSubmission>) => null | string,
  StatusDistribution?: (data: WithTypename<StatusDistribution>) => null | string,
  Studio?: (data: WithTypename<Studio>) => null | string,
  StudioConnection?: (data: WithTypename<StudioConnection>) => null | string,
  StudioEdge?: (data: WithTypename<StudioEdge>) => null | string,
  StudioStats?: (data: WithTypename<StudioStats>) => null | string,
  TagStats?: (data: WithTypename<TagStats>) => null | string,
  TextActivity?: (data: WithTypename<TextActivity>) => null | string,
  Thread?: (data: WithTypename<Thread>) => null | string,
  ThreadCategory?: (data: WithTypename<ThreadCategory>) => null | string,
  ThreadComment?: (data: WithTypename<ThreadComment>) => null | string,
  ThreadCommentLikeNotification?: (data: WithTypename<ThreadCommentLikeNotification>) => null | string,
  ThreadCommentMentionNotification?: (data: WithTypename<ThreadCommentMentionNotification>) => null | string,
  ThreadCommentReplyNotification?: (data: WithTypename<ThreadCommentReplyNotification>) => null | string,
  ThreadCommentSubscribedNotification?: (data: WithTypename<ThreadCommentSubscribedNotification>) => null | string,
  ThreadLikeNotification?: (data: WithTypename<ThreadLikeNotification>) => null | string,
  User?: (data: WithTypename<User>) => null | string,
  UserActivityHistory?: (data: WithTypename<UserActivityHistory>) => null | string,
  UserAvatar?: (data: WithTypename<UserAvatar>) => null | string,
  UserCountryStatistic?: (data: WithTypename<UserCountryStatistic>) => null | string,
  UserFormatStatistic?: (data: WithTypename<UserFormatStatistic>) => null | string,
  UserGenreStatistic?: (data: WithTypename<UserGenreStatistic>) => null | string,
  UserLengthStatistic?: (data: WithTypename<UserLengthStatistic>) => null | string,
  UserModData?: (data: WithTypename<UserModData>) => null | string,
  UserOptions?: (data: WithTypename<UserOptions>) => null | string,
  UserPreviousName?: (data: WithTypename<UserPreviousName>) => null | string,
  UserReleaseYearStatistic?: (data: WithTypename<UserReleaseYearStatistic>) => null | string,
  UserScoreStatistic?: (data: WithTypename<UserScoreStatistic>) => null | string,
  UserStaffStatistic?: (data: WithTypename<UserStaffStatistic>) => null | string,
  UserStartYearStatistic?: (data: WithTypename<UserStartYearStatistic>) => null | string,
  UserStatisticTypes?: (data: WithTypename<UserStatisticTypes>) => null | string,
  UserStatistics?: (data: WithTypename<UserStatistics>) => null | string,
  UserStats?: (data: WithTypename<UserStats>) => null | string,
  UserStatusStatistic?: (data: WithTypename<UserStatusStatistic>) => null | string,
  UserStudioStatistic?: (data: WithTypename<UserStudioStatistic>) => null | string,
  UserTagStatistic?: (data: WithTypename<UserTagStatistic>) => null | string,
  UserVoiceActorStatistic?: (data: WithTypename<UserVoiceActorStatistic>) => null | string,
  YearStats?: (data: WithTypename<YearStats>) => null | string
}

export type GraphCacheResolvers = {
  Query?: {
    Activity?: GraphCacheResolver<WithTypename<Query>, QueryActivityArgs, WithTypename<ActivityUnion> | string>,
    ActivityReply?: GraphCacheResolver<WithTypename<Query>, QueryActivityReplyArgs, WithTypename<ActivityReply> | string>,
    AiringSchedule?: GraphCacheResolver<WithTypename<Query>, QueryAiringScheduleArgs, WithTypename<AiringSchedule> | string>,
    AniChartUser?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<AniChartUser> | string>,
    Character?: GraphCacheResolver<WithTypename<Query>, QueryCharacterArgs, WithTypename<Character> | string>,
    ExternalLinkSourceCollection?: GraphCacheResolver<WithTypename<Query>, QueryExternalLinkSourceCollectionArgs, Array<WithTypename<MediaExternalLink> | string>>,
    Follower?: GraphCacheResolver<WithTypename<Query>, QueryFollowerArgs, WithTypename<User> | string>,
    Following?: GraphCacheResolver<WithTypename<Query>, QueryFollowingArgs, WithTypename<User> | string>,
    GenreCollection?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<Scalars['String'] | string>>,
    Like?: GraphCacheResolver<WithTypename<Query>, QueryLikeArgs, WithTypename<User> | string>,
    Markdown?: GraphCacheResolver<WithTypename<Query>, QueryMarkdownArgs, WithTypename<ParsedMarkdown> | string>,
    Media?: GraphCacheResolver<WithTypename<Query>, QueryMediaArgs, WithTypename<Media> | string>,
    MediaList?: GraphCacheResolver<WithTypename<Query>, QueryMediaListArgs, WithTypename<MediaList> | string>,
    MediaListCollection?: GraphCacheResolver<WithTypename<Query>, QueryMediaListCollectionArgs, WithTypename<MediaListCollection> | string>,
    MediaTagCollection?: GraphCacheResolver<WithTypename<Query>, QueryMediaTagCollectionArgs, Array<WithTypename<MediaTag> | string>>,
    MediaTrend?: GraphCacheResolver<WithTypename<Query>, QueryMediaTrendArgs, WithTypename<MediaTrend> | string>,
    Notification?: GraphCacheResolver<WithTypename<Query>, QueryNotificationArgs, WithTypename<NotificationUnion> | string>,
    Page?: GraphCacheResolver<WithTypename<Query>, QueryPageArgs, WithTypename<Page> | string>,
    Recommendation?: GraphCacheResolver<WithTypename<Query>, QueryRecommendationArgs, WithTypename<Recommendation> | string>,
    Review?: GraphCacheResolver<WithTypename<Query>, QueryReviewArgs, WithTypename<Review> | string>,
    SiteStatistics?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<SiteStatistics> | string>,
    Staff?: GraphCacheResolver<WithTypename<Query>, QueryStaffArgs, WithTypename<Staff> | string>,
    Studio?: GraphCacheResolver<WithTypename<Query>, QueryStudioArgs, WithTypename<Studio> | string>,
    Thread?: GraphCacheResolver<WithTypename<Query>, QueryThreadArgs, WithTypename<Thread> | string>,
    ThreadComment?: GraphCacheResolver<WithTypename<Query>, QueryThreadCommentArgs, Array<WithTypename<ThreadComment> | string>>,
    User?: GraphCacheResolver<WithTypename<Query>, QueryUserArgs, WithTypename<User> | string>,
    Viewer?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<User> | string>
  },
  ActivityLikeNotification?: {
    activity?: GraphCacheResolver<WithTypename<ActivityLikeNotification>, Record<string, never>, WithTypename<ActivityUnion> | string>,
    activityId?: GraphCacheResolver<WithTypename<ActivityLikeNotification>, Record<string, never>, Scalars['Int'] | string>,
    context?: GraphCacheResolver<WithTypename<ActivityLikeNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ActivityLikeNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ActivityLikeNotification>, Record<string, never>, Scalars['Int'] | string>,
    type?: GraphCacheResolver<WithTypename<ActivityLikeNotification>, Record<string, never>, NotificationType | string>,
    user?: GraphCacheResolver<WithTypename<ActivityLikeNotification>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ActivityLikeNotification>, Record<string, never>, Scalars['Int'] | string>
  },
  ActivityMentionNotification?: {
    activity?: GraphCacheResolver<WithTypename<ActivityMentionNotification>, Record<string, never>, WithTypename<ActivityUnion> | string>,
    activityId?: GraphCacheResolver<WithTypename<ActivityMentionNotification>, Record<string, never>, Scalars['Int'] | string>,
    context?: GraphCacheResolver<WithTypename<ActivityMentionNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ActivityMentionNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ActivityMentionNotification>, Record<string, never>, Scalars['Int'] | string>,
    type?: GraphCacheResolver<WithTypename<ActivityMentionNotification>, Record<string, never>, NotificationType | string>,
    user?: GraphCacheResolver<WithTypename<ActivityMentionNotification>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ActivityMentionNotification>, Record<string, never>, Scalars['Int'] | string>
  },
  ActivityMessageNotification?: {
    activityId?: GraphCacheResolver<WithTypename<ActivityMessageNotification>, Record<string, never>, Scalars['Int'] | string>,
    context?: GraphCacheResolver<WithTypename<ActivityMessageNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ActivityMessageNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ActivityMessageNotification>, Record<string, never>, Scalars['Int'] | string>,
    message?: GraphCacheResolver<WithTypename<ActivityMessageNotification>, Record<string, never>, WithTypename<MessageActivity> | string>,
    type?: GraphCacheResolver<WithTypename<ActivityMessageNotification>, Record<string, never>, NotificationType | string>,
    user?: GraphCacheResolver<WithTypename<ActivityMessageNotification>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ActivityMessageNotification>, Record<string, never>, Scalars['Int'] | string>
  },
  ActivityReply?: {
    activityId?: GraphCacheResolver<WithTypename<ActivityReply>, Record<string, never>, Scalars['Int'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ActivityReply>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ActivityReply>, Record<string, never>, Scalars['Int'] | string>,
    isLiked?: GraphCacheResolver<WithTypename<ActivityReply>, Record<string, never>, Scalars['Boolean'] | string>,
    likeCount?: GraphCacheResolver<WithTypename<ActivityReply>, Record<string, never>, Scalars['Int'] | string>,
    likes?: GraphCacheResolver<WithTypename<ActivityReply>, Record<string, never>, Array<WithTypename<User> | string>>,
    text?: GraphCacheResolver<WithTypename<ActivityReply>, ActivityReplyTextArgs, Scalars['String'] | string>,
    user?: GraphCacheResolver<WithTypename<ActivityReply>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ActivityReply>, Record<string, never>, Scalars['Int'] | string>
  },
  ActivityReplyLikeNotification?: {
    activity?: GraphCacheResolver<WithTypename<ActivityReplyLikeNotification>, Record<string, never>, WithTypename<ActivityUnion> | string>,
    activityId?: GraphCacheResolver<WithTypename<ActivityReplyLikeNotification>, Record<string, never>, Scalars['Int'] | string>,
    context?: GraphCacheResolver<WithTypename<ActivityReplyLikeNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ActivityReplyLikeNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ActivityReplyLikeNotification>, Record<string, never>, Scalars['Int'] | string>,
    type?: GraphCacheResolver<WithTypename<ActivityReplyLikeNotification>, Record<string, never>, NotificationType | string>,
    user?: GraphCacheResolver<WithTypename<ActivityReplyLikeNotification>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ActivityReplyLikeNotification>, Record<string, never>, Scalars['Int'] | string>
  },
  ActivityReplyNotification?: {
    activity?: GraphCacheResolver<WithTypename<ActivityReplyNotification>, Record<string, never>, WithTypename<ActivityUnion> | string>,
    activityId?: GraphCacheResolver<WithTypename<ActivityReplyNotification>, Record<string, never>, Scalars['Int'] | string>,
    context?: GraphCacheResolver<WithTypename<ActivityReplyNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ActivityReplyNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ActivityReplyNotification>, Record<string, never>, Scalars['Int'] | string>,
    type?: GraphCacheResolver<WithTypename<ActivityReplyNotification>, Record<string, never>, NotificationType | string>,
    user?: GraphCacheResolver<WithTypename<ActivityReplyNotification>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ActivityReplyNotification>, Record<string, never>, Scalars['Int'] | string>
  },
  ActivityReplySubscribedNotification?: {
    activity?: GraphCacheResolver<WithTypename<ActivityReplySubscribedNotification>, Record<string, never>, WithTypename<ActivityUnion> | string>,
    activityId?: GraphCacheResolver<WithTypename<ActivityReplySubscribedNotification>, Record<string, never>, Scalars['Int'] | string>,
    context?: GraphCacheResolver<WithTypename<ActivityReplySubscribedNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ActivityReplySubscribedNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ActivityReplySubscribedNotification>, Record<string, never>, Scalars['Int'] | string>,
    type?: GraphCacheResolver<WithTypename<ActivityReplySubscribedNotification>, Record<string, never>, NotificationType | string>,
    user?: GraphCacheResolver<WithTypename<ActivityReplySubscribedNotification>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ActivityReplySubscribedNotification>, Record<string, never>, Scalars['Int'] | string>
  },
  AiringNotification?: {
    animeId?: GraphCacheResolver<WithTypename<AiringNotification>, Record<string, never>, Scalars['Int'] | string>,
    contexts?: GraphCacheResolver<WithTypename<AiringNotification>, Record<string, never>, Array<Scalars['String'] | string>>,
    createdAt?: GraphCacheResolver<WithTypename<AiringNotification>, Record<string, never>, Scalars['Int'] | string>,
    episode?: GraphCacheResolver<WithTypename<AiringNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<AiringNotification>, Record<string, never>, Scalars['Int'] | string>,
    media?: GraphCacheResolver<WithTypename<AiringNotification>, Record<string, never>, WithTypename<Media> | string>,
    type?: GraphCacheResolver<WithTypename<AiringNotification>, Record<string, never>, NotificationType | string>
  },
  AiringProgression?: {
    episode?: GraphCacheResolver<WithTypename<AiringProgression>, Record<string, never>, Scalars['Float'] | string>,
    score?: GraphCacheResolver<WithTypename<AiringProgression>, Record<string, never>, Scalars['Float'] | string>,
    watching?: GraphCacheResolver<WithTypename<AiringProgression>, Record<string, never>, Scalars['Int'] | string>
  },
  AiringSchedule?: {
    airingAt?: GraphCacheResolver<WithTypename<AiringSchedule>, Record<string, never>, Scalars['Int'] | string>,
    episode?: GraphCacheResolver<WithTypename<AiringSchedule>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<AiringSchedule>, Record<string, never>, Scalars['Int'] | string>,
    media?: GraphCacheResolver<WithTypename<AiringSchedule>, Record<string, never>, WithTypename<Media> | string>,
    mediaId?: GraphCacheResolver<WithTypename<AiringSchedule>, Record<string, never>, Scalars['Int'] | string>,
    timeUntilAiring?: GraphCacheResolver<WithTypename<AiringSchedule>, Record<string, never>, Scalars['Int'] | string>
  },
  AiringScheduleConnection?: {
    edges?: GraphCacheResolver<WithTypename<AiringScheduleConnection>, Record<string, never>, Array<WithTypename<AiringScheduleEdge> | string>>,
    nodes?: GraphCacheResolver<WithTypename<AiringScheduleConnection>, Record<string, never>, Array<WithTypename<AiringSchedule> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<AiringScheduleConnection>, Record<string, never>, WithTypename<PageInfo> | string>
  },
  AiringScheduleEdge?: {
    id?: GraphCacheResolver<WithTypename<AiringScheduleEdge>, Record<string, never>, Scalars['Int'] | string>,
    node?: GraphCacheResolver<WithTypename<AiringScheduleEdge>, Record<string, never>, WithTypename<AiringSchedule> | string>
  },
  AniChartUser?: {
    highlights?: GraphCacheResolver<WithTypename<AniChartUser>, Record<string, never>, Scalars['Json'] | string>,
    settings?: GraphCacheResolver<WithTypename<AniChartUser>, Record<string, never>, Scalars['Json'] | string>,
    user?: GraphCacheResolver<WithTypename<AniChartUser>, Record<string, never>, WithTypename<User> | string>
  },
  Character?: {
    age?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, Scalars['String'] | string>,
    bloodType?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, Scalars['String'] | string>,
    dateOfBirth?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, WithTypename<FuzzyDate> | string>,
    description?: GraphCacheResolver<WithTypename<Character>, CharacterDescriptionArgs, Scalars['String'] | string>,
    favourites?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, Scalars['Int'] | string>,
    gender?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, Scalars['Int'] | string>,
    image?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, WithTypename<CharacterImage> | string>,
    isFavourite?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, Scalars['Boolean'] | string>,
    isFavouriteBlocked?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, Scalars['Boolean'] | string>,
    media?: GraphCacheResolver<WithTypename<Character>, CharacterMediaArgs, WithTypename<MediaConnection> | string>,
    modNotes?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, WithTypename<CharacterName> | string>,
    siteUrl?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<Character>, Record<string, never>, Scalars['Int'] | string>
  },
  CharacterConnection?: {
    edges?: GraphCacheResolver<WithTypename<CharacterConnection>, Record<string, never>, Array<WithTypename<CharacterEdge> | string>>,
    nodes?: GraphCacheResolver<WithTypename<CharacterConnection>, Record<string, never>, Array<WithTypename<Character> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<CharacterConnection>, Record<string, never>, WithTypename<PageInfo> | string>
  },
  CharacterEdge?: {
    favouriteOrder?: GraphCacheResolver<WithTypename<CharacterEdge>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<CharacterEdge>, Record<string, never>, Scalars['Int'] | string>,
    media?: GraphCacheResolver<WithTypename<CharacterEdge>, Record<string, never>, Array<WithTypename<Media> | string>>,
    name?: GraphCacheResolver<WithTypename<CharacterEdge>, Record<string, never>, Scalars['String'] | string>,
    node?: GraphCacheResolver<WithTypename<CharacterEdge>, Record<string, never>, WithTypename<Character> | string>,
    role?: GraphCacheResolver<WithTypename<CharacterEdge>, Record<string, never>, CharacterRole | string>,
    voiceActorRoles?: GraphCacheResolver<WithTypename<CharacterEdge>, CharacterEdgeVoiceActorRolesArgs, Array<WithTypename<StaffRoleType> | string>>,
    voiceActors?: GraphCacheResolver<WithTypename<CharacterEdge>, CharacterEdgeVoiceActorsArgs, Array<WithTypename<Staff> | string>>
  },
  CharacterImage?: {
    large?: GraphCacheResolver<WithTypename<CharacterImage>, Record<string, never>, Scalars['String'] | string>,
    medium?: GraphCacheResolver<WithTypename<CharacterImage>, Record<string, never>, Scalars['String'] | string>
  },
  CharacterName?: {
    alternative?: GraphCacheResolver<WithTypename<CharacterName>, Record<string, never>, Array<Scalars['String'] | string>>,
    alternativeSpoiler?: GraphCacheResolver<WithTypename<CharacterName>, Record<string, never>, Array<Scalars['String'] | string>>,
    first?: GraphCacheResolver<WithTypename<CharacterName>, Record<string, never>, Scalars['String'] | string>,
    full?: GraphCacheResolver<WithTypename<CharacterName>, Record<string, never>, Scalars['String'] | string>,
    last?: GraphCacheResolver<WithTypename<CharacterName>, Record<string, never>, Scalars['String'] | string>,
    middle?: GraphCacheResolver<WithTypename<CharacterName>, Record<string, never>, Scalars['String'] | string>,
    native?: GraphCacheResolver<WithTypename<CharacterName>, Record<string, never>, Scalars['String'] | string>,
    userPreferred?: GraphCacheResolver<WithTypename<CharacterName>, Record<string, never>, Scalars['String'] | string>
  },
  CharacterSubmission?: {
    assignee?: GraphCacheResolver<WithTypename<CharacterSubmission>, Record<string, never>, WithTypename<User> | string>,
    character?: GraphCacheResolver<WithTypename<CharacterSubmission>, Record<string, never>, WithTypename<Character> | string>,
    createdAt?: GraphCacheResolver<WithTypename<CharacterSubmission>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<CharacterSubmission>, Record<string, never>, Scalars['Int'] | string>,
    locked?: GraphCacheResolver<WithTypename<CharacterSubmission>, Record<string, never>, Scalars['Boolean'] | string>,
    notes?: GraphCacheResolver<WithTypename<CharacterSubmission>, Record<string, never>, Scalars['String'] | string>,
    source?: GraphCacheResolver<WithTypename<CharacterSubmission>, Record<string, never>, Scalars['String'] | string>,
    status?: GraphCacheResolver<WithTypename<CharacterSubmission>, Record<string, never>, SubmissionStatus | string>,
    submission?: GraphCacheResolver<WithTypename<CharacterSubmission>, Record<string, never>, WithTypename<Character> | string>,
    submitter?: GraphCacheResolver<WithTypename<CharacterSubmission>, Record<string, never>, WithTypename<User> | string>
  },
  CharacterSubmissionConnection?: {
    edges?: GraphCacheResolver<WithTypename<CharacterSubmissionConnection>, Record<string, never>, Array<WithTypename<CharacterSubmissionEdge> | string>>,
    nodes?: GraphCacheResolver<WithTypename<CharacterSubmissionConnection>, Record<string, never>, Array<WithTypename<CharacterSubmission> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<CharacterSubmissionConnection>, Record<string, never>, WithTypename<PageInfo> | string>
  },
  CharacterSubmissionEdge?: {
    node?: GraphCacheResolver<WithTypename<CharacterSubmissionEdge>, Record<string, never>, WithTypename<CharacterSubmission> | string>,
    role?: GraphCacheResolver<WithTypename<CharacterSubmissionEdge>, Record<string, never>, CharacterRole | string>,
    submittedVoiceActors?: GraphCacheResolver<WithTypename<CharacterSubmissionEdge>, Record<string, never>, Array<WithTypename<StaffSubmission> | string>>,
    voiceActors?: GraphCacheResolver<WithTypename<CharacterSubmissionEdge>, Record<string, never>, Array<WithTypename<Staff> | string>>
  },
  Deleted?: {
    deleted?: GraphCacheResolver<WithTypename<Deleted>, Record<string, never>, Scalars['Boolean'] | string>
  },
  Favourites?: {
    anime?: GraphCacheResolver<WithTypename<Favourites>, FavouritesAnimeArgs, WithTypename<MediaConnection> | string>,
    characters?: GraphCacheResolver<WithTypename<Favourites>, FavouritesCharactersArgs, WithTypename<CharacterConnection> | string>,
    manga?: GraphCacheResolver<WithTypename<Favourites>, FavouritesMangaArgs, WithTypename<MediaConnection> | string>,
    staff?: GraphCacheResolver<WithTypename<Favourites>, FavouritesStaffArgs, WithTypename<StaffConnection> | string>,
    studios?: GraphCacheResolver<WithTypename<Favourites>, FavouritesStudiosArgs, WithTypename<StudioConnection> | string>
  },
  FollowingNotification?: {
    context?: GraphCacheResolver<WithTypename<FollowingNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<FollowingNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<FollowingNotification>, Record<string, never>, Scalars['Int'] | string>,
    type?: GraphCacheResolver<WithTypename<FollowingNotification>, Record<string, never>, NotificationType | string>,
    user?: GraphCacheResolver<WithTypename<FollowingNotification>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<FollowingNotification>, Record<string, never>, Scalars['Int'] | string>
  },
  FormatStats?: {
    amount?: GraphCacheResolver<WithTypename<FormatStats>, Record<string, never>, Scalars['Int'] | string>,
    format?: GraphCacheResolver<WithTypename<FormatStats>, Record<string, never>, MediaFormat | string>
  },
  FuzzyDate?: {
    day?: GraphCacheResolver<WithTypename<FuzzyDate>, Record<string, never>, Scalars['Int'] | string>,
    month?: GraphCacheResolver<WithTypename<FuzzyDate>, Record<string, never>, Scalars['Int'] | string>,
    year?: GraphCacheResolver<WithTypename<FuzzyDate>, Record<string, never>, Scalars['Int'] | string>
  },
  GenreStats?: {
    amount?: GraphCacheResolver<WithTypename<GenreStats>, Record<string, never>, Scalars['Int'] | string>,
    genre?: GraphCacheResolver<WithTypename<GenreStats>, Record<string, never>, Scalars['String'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<GenreStats>, Record<string, never>, Scalars['Int'] | string>,
    timeWatched?: GraphCacheResolver<WithTypename<GenreStats>, Record<string, never>, Scalars['Int'] | string>
  },
  InternalPage?: {
    activities?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageActivitiesArgs, Array<WithTypename<ActivityUnion> | string>>,
    activityReplies?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageActivityRepliesArgs, Array<WithTypename<ActivityReply> | string>>,
    airingSchedules?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageAiringSchedulesArgs, Array<WithTypename<AiringSchedule> | string>>,
    characterSubmissions?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageCharacterSubmissionsArgs, Array<WithTypename<CharacterSubmission> | string>>,
    characters?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageCharactersArgs, Array<WithTypename<Character> | string>>,
    followers?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageFollowersArgs, Array<WithTypename<User> | string>>,
    following?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageFollowingArgs, Array<WithTypename<User> | string>>,
    likes?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageLikesArgs, Array<WithTypename<User> | string>>,
    media?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageMediaArgs, Array<WithTypename<Media> | string>>,
    mediaList?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageMediaListArgs, Array<WithTypename<MediaList> | string>>,
    mediaSubmissions?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageMediaSubmissionsArgs, Array<WithTypename<MediaSubmission> | string>>,
    mediaTrends?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageMediaTrendsArgs, Array<WithTypename<MediaTrend> | string>>,
    modActions?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageModActionsArgs, Array<WithTypename<ModAction> | string>>,
    notifications?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageNotificationsArgs, Array<WithTypename<NotificationUnion> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<InternalPage>, Record<string, never>, WithTypename<PageInfo> | string>,
    recommendations?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageRecommendationsArgs, Array<WithTypename<Recommendation> | string>>,
    reports?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageReportsArgs, Array<WithTypename<Report> | string>>,
    reviews?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageReviewsArgs, Array<WithTypename<Review> | string>>,
    revisionHistory?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageRevisionHistoryArgs, Array<WithTypename<RevisionHistory> | string>>,
    staff?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageStaffArgs, Array<WithTypename<Staff> | string>>,
    staffSubmissions?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageStaffSubmissionsArgs, Array<WithTypename<StaffSubmission> | string>>,
    studios?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageStudiosArgs, Array<WithTypename<Studio> | string>>,
    threadComments?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageThreadCommentsArgs, Array<WithTypename<ThreadComment> | string>>,
    threads?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageThreadsArgs, Array<WithTypename<Thread> | string>>,
    userBlockSearch?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageUserBlockSearchArgs, Array<WithTypename<User> | string>>,
    users?: GraphCacheResolver<WithTypename<InternalPage>, InternalPageUsersArgs, Array<WithTypename<User> | string>>
  },
  ListActivity?: {
    createdAt?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Scalars['Int'] | string>,
    isLiked?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Scalars['Boolean'] | string>,
    isLocked?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Scalars['Boolean'] | string>,
    isPinned?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Scalars['Boolean'] | string>,
    isSubscribed?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Scalars['Boolean'] | string>,
    likeCount?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Scalars['Int'] | string>,
    likes?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Array<WithTypename<User> | string>>,
    media?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, WithTypename<Media> | string>,
    progress?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Scalars['String'] | string>,
    replies?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Array<WithTypename<ActivityReply> | string>>,
    replyCount?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Scalars['Int'] | string>,
    siteUrl?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Scalars['String'] | string>,
    status?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Scalars['String'] | string>,
    type?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, ActivityType | string>,
    user?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ListActivity>, Record<string, never>, Scalars['Int'] | string>
  },
  ListActivityOption?: {
    disabled?: GraphCacheResolver<WithTypename<ListActivityOption>, Record<string, never>, Scalars['Boolean'] | string>,
    type?: GraphCacheResolver<WithTypename<ListActivityOption>, Record<string, never>, MediaListStatus | string>
  },
  ListScoreStats?: {
    meanScore?: GraphCacheResolver<WithTypename<ListScoreStats>, Record<string, never>, Scalars['Int'] | string>,
    standardDeviation?: GraphCacheResolver<WithTypename<ListScoreStats>, Record<string, never>, Scalars['Int'] | string>
  },
  Media?: {
    airingSchedule?: GraphCacheResolver<WithTypename<Media>, MediaAiringScheduleArgs, WithTypename<AiringScheduleConnection> | string>,
    autoCreateForumThread?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Boolean'] | string>,
    averageScore?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    bannerImage?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['String'] | string>,
    chapters?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    characters?: GraphCacheResolver<WithTypename<Media>, MediaCharactersArgs, WithTypename<CharacterConnection> | string>,
    countryOfOrigin?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['CountryCode'] | string>,
    coverImage?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, WithTypename<MediaCoverImage> | string>,
    description?: GraphCacheResolver<WithTypename<Media>, MediaDescriptionArgs, Scalars['String'] | string>,
    duration?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    endDate?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, WithTypename<FuzzyDate> | string>,
    episodes?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    externalLinks?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Array<WithTypename<MediaExternalLink> | string>>,
    favourites?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    format?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, MediaFormat | string>,
    genres?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Array<Scalars['String'] | string>>,
    hashtag?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    idMal?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    isAdult?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Boolean'] | string>,
    isFavourite?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Boolean'] | string>,
    isFavouriteBlocked?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Boolean'] | string>,
    isLicensed?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Boolean'] | string>,
    isLocked?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Boolean'] | string>,
    isRecommendationBlocked?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Boolean'] | string>,
    isReviewBlocked?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Boolean'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    mediaListEntry?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, WithTypename<MediaList> | string>,
    modNotes?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['String'] | string>,
    nextAiringEpisode?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, WithTypename<AiringSchedule> | string>,
    popularity?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    rankings?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Array<WithTypename<MediaRank> | string>>,
    recommendations?: GraphCacheResolver<WithTypename<Media>, MediaRecommendationsArgs, WithTypename<RecommendationConnection> | string>,
    relations?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, WithTypename<MediaConnection> | string>,
    reviews?: GraphCacheResolver<WithTypename<Media>, MediaReviewsArgs, WithTypename<ReviewConnection> | string>,
    season?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, MediaSeason | string>,
    seasonInt?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    seasonYear?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    siteUrl?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['String'] | string>,
    source?: GraphCacheResolver<WithTypename<Media>, MediaSourceArgs, MediaSource | string>,
    staff?: GraphCacheResolver<WithTypename<Media>, MediaStaffArgs, WithTypename<StaffConnection> | string>,
    startDate?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, WithTypename<FuzzyDate> | string>,
    stats?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, WithTypename<MediaStats> | string>,
    status?: GraphCacheResolver<WithTypename<Media>, MediaStatusArgs, MediaStatus | string>,
    streamingEpisodes?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Array<WithTypename<MediaStreamingEpisode> | string>>,
    studios?: GraphCacheResolver<WithTypename<Media>, MediaStudiosArgs, WithTypename<StudioConnection> | string>,
    synonyms?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Array<Scalars['String'] | string>>,
    tags?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Array<WithTypename<MediaTag> | string>>,
    title?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, WithTypename<MediaTitle> | string>,
    trailer?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, WithTypename<MediaTrailer> | string>,
    trending?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    trends?: GraphCacheResolver<WithTypename<Media>, MediaTrendsArgs, WithTypename<MediaTrendConnection> | string>,
    type?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, MediaType | string>,
    updatedAt?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>,
    volumes?: GraphCacheResolver<WithTypename<Media>, Record<string, never>, Scalars['Int'] | string>
  },
  MediaCharacter?: {
    character?: GraphCacheResolver<WithTypename<MediaCharacter>, Record<string, never>, WithTypename<Character> | string>,
    characterName?: GraphCacheResolver<WithTypename<MediaCharacter>, Record<string, never>, Scalars['String'] | string>,
    dubGroup?: GraphCacheResolver<WithTypename<MediaCharacter>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<MediaCharacter>, Record<string, never>, Scalars['Int'] | string>,
    role?: GraphCacheResolver<WithTypename<MediaCharacter>, Record<string, never>, CharacterRole | string>,
    roleNotes?: GraphCacheResolver<WithTypename<MediaCharacter>, Record<string, never>, Scalars['String'] | string>,
    voiceActor?: GraphCacheResolver<WithTypename<MediaCharacter>, Record<string, never>, WithTypename<Staff> | string>
  },
  MediaConnection?: {
    edges?: GraphCacheResolver<WithTypename<MediaConnection>, Record<string, never>, Array<WithTypename<MediaEdge> | string>>,
    nodes?: GraphCacheResolver<WithTypename<MediaConnection>, Record<string, never>, Array<WithTypename<Media> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<MediaConnection>, Record<string, never>, WithTypename<PageInfo> | string>
  },
  MediaCoverImage?: {
    color?: GraphCacheResolver<WithTypename<MediaCoverImage>, Record<string, never>, Scalars['String'] | string>,
    extraLarge?: GraphCacheResolver<WithTypename<MediaCoverImage>, Record<string, never>, Scalars['String'] | string>,
    large?: GraphCacheResolver<WithTypename<MediaCoverImage>, Record<string, never>, Scalars['String'] | string>,
    medium?: GraphCacheResolver<WithTypename<MediaCoverImage>, Record<string, never>, Scalars['String'] | string>
  },
  MediaDataChangeNotification?: {
    context?: GraphCacheResolver<WithTypename<MediaDataChangeNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<MediaDataChangeNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<MediaDataChangeNotification>, Record<string, never>, Scalars['Int'] | string>,
    media?: GraphCacheResolver<WithTypename<MediaDataChangeNotification>, Record<string, never>, WithTypename<Media> | string>,
    mediaId?: GraphCacheResolver<WithTypename<MediaDataChangeNotification>, Record<string, never>, Scalars['Int'] | string>,
    reason?: GraphCacheResolver<WithTypename<MediaDataChangeNotification>, Record<string, never>, Scalars['String'] | string>,
    type?: GraphCacheResolver<WithTypename<MediaDataChangeNotification>, Record<string, never>, NotificationType | string>
  },
  MediaDeletionNotification?: {
    context?: GraphCacheResolver<WithTypename<MediaDeletionNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<MediaDeletionNotification>, Record<string, never>, Scalars['Int'] | string>,
    deletedMediaTitle?: GraphCacheResolver<WithTypename<MediaDeletionNotification>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<MediaDeletionNotification>, Record<string, never>, Scalars['Int'] | string>,
    reason?: GraphCacheResolver<WithTypename<MediaDeletionNotification>, Record<string, never>, Scalars['String'] | string>,
    type?: GraphCacheResolver<WithTypename<MediaDeletionNotification>, Record<string, never>, NotificationType | string>
  },
  MediaEdge?: {
    characterName?: GraphCacheResolver<WithTypename<MediaEdge>, Record<string, never>, Scalars['String'] | string>,
    characterRole?: GraphCacheResolver<WithTypename<MediaEdge>, Record<string, never>, CharacterRole | string>,
    characters?: GraphCacheResolver<WithTypename<MediaEdge>, Record<string, never>, Array<WithTypename<Character> | string>>,
    dubGroup?: GraphCacheResolver<WithTypename<MediaEdge>, Record<string, never>, Scalars['String'] | string>,
    favouriteOrder?: GraphCacheResolver<WithTypename<MediaEdge>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<MediaEdge>, Record<string, never>, Scalars['Int'] | string>,
    isMainStudio?: GraphCacheResolver<WithTypename<MediaEdge>, Record<string, never>, Scalars['Boolean'] | string>,
    node?: GraphCacheResolver<WithTypename<MediaEdge>, Record<string, never>, WithTypename<Media> | string>,
    relationType?: GraphCacheResolver<WithTypename<MediaEdge>, MediaEdgeRelationTypeArgs, MediaRelation | string>,
    roleNotes?: GraphCacheResolver<WithTypename<MediaEdge>, Record<string, never>, Scalars['String'] | string>,
    staffRole?: GraphCacheResolver<WithTypename<MediaEdge>, Record<string, never>, Scalars['String'] | string>,
    voiceActorRoles?: GraphCacheResolver<WithTypename<MediaEdge>, MediaEdgeVoiceActorRolesArgs, Array<WithTypename<StaffRoleType> | string>>,
    voiceActors?: GraphCacheResolver<WithTypename<MediaEdge>, MediaEdgeVoiceActorsArgs, Array<WithTypename<Staff> | string>>
  },
  MediaExternalLink?: {
    color?: GraphCacheResolver<WithTypename<MediaExternalLink>, Record<string, never>, Scalars['String'] | string>,
    icon?: GraphCacheResolver<WithTypename<MediaExternalLink>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<MediaExternalLink>, Record<string, never>, Scalars['Int'] | string>,
    isDisabled?: GraphCacheResolver<WithTypename<MediaExternalLink>, Record<string, never>, Scalars['Boolean'] | string>,
    language?: GraphCacheResolver<WithTypename<MediaExternalLink>, Record<string, never>, Scalars['String'] | string>,
    notes?: GraphCacheResolver<WithTypename<MediaExternalLink>, Record<string, never>, Scalars['String'] | string>,
    site?: GraphCacheResolver<WithTypename<MediaExternalLink>, Record<string, never>, Scalars['String'] | string>,
    siteId?: GraphCacheResolver<WithTypename<MediaExternalLink>, Record<string, never>, Scalars['Int'] | string>,
    type?: GraphCacheResolver<WithTypename<MediaExternalLink>, Record<string, never>, ExternalLinkType | string>,
    url?: GraphCacheResolver<WithTypename<MediaExternalLink>, Record<string, never>, Scalars['String'] | string>
  },
  MediaList?: {
    advancedScores?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['Json'] | string>,
    completedAt?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, WithTypename<FuzzyDate> | string>,
    createdAt?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['Int'] | string>,
    customLists?: GraphCacheResolver<WithTypename<MediaList>, MediaListCustomListsArgs, Scalars['Json'] | string>,
    hiddenFromStatusLists?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['Boolean'] | string>,
    id?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['Int'] | string>,
    media?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, WithTypename<Media> | string>,
    mediaId?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['Int'] | string>,
    notes?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['String'] | string>,
    priority?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['Int'] | string>,
    private?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['Boolean'] | string>,
    progress?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['Int'] | string>,
    progressVolumes?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['Int'] | string>,
    repeat?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['Int'] | string>,
    score?: GraphCacheResolver<WithTypename<MediaList>, MediaListScoreArgs, Scalars['Float'] | string>,
    startedAt?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, WithTypename<FuzzyDate> | string>,
    status?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, MediaListStatus | string>,
    updatedAt?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['Int'] | string>,
    user?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<MediaList>, Record<string, never>, Scalars['Int'] | string>
  },
  MediaListCollection?: {
    customLists?: GraphCacheResolver<WithTypename<MediaListCollection>, MediaListCollectionCustomListsArgs, Array<Array<WithTypename<MediaList> | string>>>,
    hasNextChunk?: GraphCacheResolver<WithTypename<MediaListCollection>, Record<string, never>, Scalars['Boolean'] | string>,
    lists?: GraphCacheResolver<WithTypename<MediaListCollection>, Record<string, never>, Array<WithTypename<MediaListGroup> | string>>,
    statusLists?: GraphCacheResolver<WithTypename<MediaListCollection>, MediaListCollectionStatusListsArgs, Array<Array<WithTypename<MediaList> | string>>>,
    user?: GraphCacheResolver<WithTypename<MediaListCollection>, Record<string, never>, WithTypename<User> | string>
  },
  MediaListGroup?: {
    entries?: GraphCacheResolver<WithTypename<MediaListGroup>, Record<string, never>, Array<WithTypename<MediaList> | string>>,
    isCustomList?: GraphCacheResolver<WithTypename<MediaListGroup>, Record<string, never>, Scalars['Boolean'] | string>,
    isSplitCompletedList?: GraphCacheResolver<WithTypename<MediaListGroup>, Record<string, never>, Scalars['Boolean'] | string>,
    name?: GraphCacheResolver<WithTypename<MediaListGroup>, Record<string, never>, Scalars['String'] | string>,
    status?: GraphCacheResolver<WithTypename<MediaListGroup>, Record<string, never>, MediaListStatus | string>
  },
  MediaListOptions?: {
    animeList?: GraphCacheResolver<WithTypename<MediaListOptions>, Record<string, never>, WithTypename<MediaListTypeOptions> | string>,
    mangaList?: GraphCacheResolver<WithTypename<MediaListOptions>, Record<string, never>, WithTypename<MediaListTypeOptions> | string>,
    rowOrder?: GraphCacheResolver<WithTypename<MediaListOptions>, Record<string, never>, Scalars['String'] | string>,
    scoreFormat?: GraphCacheResolver<WithTypename<MediaListOptions>, Record<string, never>, ScoreFormat | string>,
    sharedTheme?: GraphCacheResolver<WithTypename<MediaListOptions>, Record<string, never>, Scalars['Json'] | string>,
    sharedThemeEnabled?: GraphCacheResolver<WithTypename<MediaListOptions>, Record<string, never>, Scalars['Boolean'] | string>,
    useLegacyLists?: GraphCacheResolver<WithTypename<MediaListOptions>, Record<string, never>, Scalars['Boolean'] | string>
  },
  MediaListTypeOptions?: {
    advancedScoring?: GraphCacheResolver<WithTypename<MediaListTypeOptions>, Record<string, never>, Array<Scalars['String'] | string>>,
    advancedScoringEnabled?: GraphCacheResolver<WithTypename<MediaListTypeOptions>, Record<string, never>, Scalars['Boolean'] | string>,
    customLists?: GraphCacheResolver<WithTypename<MediaListTypeOptions>, Record<string, never>, Array<Scalars['String'] | string>>,
    sectionOrder?: GraphCacheResolver<WithTypename<MediaListTypeOptions>, Record<string, never>, Array<Scalars['String'] | string>>,
    splitCompletedSectionByFormat?: GraphCacheResolver<WithTypename<MediaListTypeOptions>, Record<string, never>, Scalars['Boolean'] | string>,
    theme?: GraphCacheResolver<WithTypename<MediaListTypeOptions>, Record<string, never>, Scalars['Json'] | string>
  },
  MediaMergeNotification?: {
    context?: GraphCacheResolver<WithTypename<MediaMergeNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<MediaMergeNotification>, Record<string, never>, Scalars['Int'] | string>,
    deletedMediaTitles?: GraphCacheResolver<WithTypename<MediaMergeNotification>, Record<string, never>, Array<Scalars['String'] | string>>,
    id?: GraphCacheResolver<WithTypename<MediaMergeNotification>, Record<string, never>, Scalars['Int'] | string>,
    media?: GraphCacheResolver<WithTypename<MediaMergeNotification>, Record<string, never>, WithTypename<Media> | string>,
    mediaId?: GraphCacheResolver<WithTypename<MediaMergeNotification>, Record<string, never>, Scalars['Int'] | string>,
    reason?: GraphCacheResolver<WithTypename<MediaMergeNotification>, Record<string, never>, Scalars['String'] | string>,
    type?: GraphCacheResolver<WithTypename<MediaMergeNotification>, Record<string, never>, NotificationType | string>
  },
  MediaRank?: {
    allTime?: GraphCacheResolver<WithTypename<MediaRank>, Record<string, never>, Scalars['Boolean'] | string>,
    context?: GraphCacheResolver<WithTypename<MediaRank>, Record<string, never>, Scalars['String'] | string>,
    format?: GraphCacheResolver<WithTypename<MediaRank>, Record<string, never>, MediaFormat | string>,
    id?: GraphCacheResolver<WithTypename<MediaRank>, Record<string, never>, Scalars['Int'] | string>,
    rank?: GraphCacheResolver<WithTypename<MediaRank>, Record<string, never>, Scalars['Int'] | string>,
    season?: GraphCacheResolver<WithTypename<MediaRank>, Record<string, never>, MediaSeason | string>,
    type?: GraphCacheResolver<WithTypename<MediaRank>, Record<string, never>, MediaRankType | string>,
    year?: GraphCacheResolver<WithTypename<MediaRank>, Record<string, never>, Scalars['Int'] | string>
  },
  MediaStats?: {
    airingProgression?: GraphCacheResolver<WithTypename<MediaStats>, Record<string, never>, Array<WithTypename<AiringProgression> | string>>,
    scoreDistribution?: GraphCacheResolver<WithTypename<MediaStats>, Record<string, never>, Array<WithTypename<ScoreDistribution> | string>>,
    statusDistribution?: GraphCacheResolver<WithTypename<MediaStats>, Record<string, never>, Array<WithTypename<StatusDistribution> | string>>
  },
  MediaStreamingEpisode?: {
    site?: GraphCacheResolver<WithTypename<MediaStreamingEpisode>, Record<string, never>, Scalars['String'] | string>,
    thumbnail?: GraphCacheResolver<WithTypename<MediaStreamingEpisode>, Record<string, never>, Scalars['String'] | string>,
    title?: GraphCacheResolver<WithTypename<MediaStreamingEpisode>, Record<string, never>, Scalars['String'] | string>,
    url?: GraphCacheResolver<WithTypename<MediaStreamingEpisode>, Record<string, never>, Scalars['String'] | string>
  },
  MediaSubmission?: {
    assignee?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, WithTypename<User> | string>,
    changes?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, Array<Scalars['String'] | string>>,
    characters?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, Array<WithTypename<MediaSubmissionComparison> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, Scalars['Int'] | string>,
    externalLinks?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, Array<WithTypename<MediaSubmissionComparison> | string>>,
    id?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, Scalars['Int'] | string>,
    locked?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, Scalars['Boolean'] | string>,
    media?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, WithTypename<Media> | string>,
    notes?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, Scalars['String'] | string>,
    relations?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, Array<WithTypename<MediaEdge> | string>>,
    source?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, Scalars['String'] | string>,
    staff?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, Array<WithTypename<MediaSubmissionComparison> | string>>,
    status?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, SubmissionStatus | string>,
    studios?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, Array<WithTypename<MediaSubmissionComparison> | string>>,
    submission?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, WithTypename<Media> | string>,
    submitter?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, WithTypename<User> | string>,
    submitterStats?: GraphCacheResolver<WithTypename<MediaSubmission>, Record<string, never>, Scalars['Json'] | string>
  },
  MediaSubmissionComparison?: {
    character?: GraphCacheResolver<WithTypename<MediaSubmissionComparison>, Record<string, never>, WithTypename<MediaCharacter> | string>,
    externalLink?: GraphCacheResolver<WithTypename<MediaSubmissionComparison>, Record<string, never>, WithTypename<MediaExternalLink> | string>,
    staff?: GraphCacheResolver<WithTypename<MediaSubmissionComparison>, Record<string, never>, WithTypename<StaffEdge> | string>,
    studio?: GraphCacheResolver<WithTypename<MediaSubmissionComparison>, Record<string, never>, WithTypename<StudioEdge> | string>,
    submission?: GraphCacheResolver<WithTypename<MediaSubmissionComparison>, Record<string, never>, WithTypename<MediaSubmissionEdge> | string>
  },
  MediaSubmissionEdge?: {
    character?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, WithTypename<Character> | string>,
    characterName?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, Scalars['String'] | string>,
    characterRole?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, CharacterRole | string>,
    characterSubmission?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, WithTypename<Character> | string>,
    dubGroup?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, Scalars['String'] | string>,
    externalLink?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, WithTypename<MediaExternalLink> | string>,
    id?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, Scalars['Int'] | string>,
    isMain?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, Scalars['Boolean'] | string>,
    media?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, WithTypename<Media> | string>,
    roleNotes?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, Scalars['String'] | string>,
    staff?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, WithTypename<Staff> | string>,
    staffRole?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, Scalars['String'] | string>,
    staffSubmission?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, WithTypename<Staff> | string>,
    studio?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, WithTypename<Studio> | string>,
    voiceActor?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, WithTypename<Staff> | string>,
    voiceActorSubmission?: GraphCacheResolver<WithTypename<MediaSubmissionEdge>, Record<string, never>, WithTypename<Staff> | string>
  },
  MediaTag?: {
    category?: GraphCacheResolver<WithTypename<MediaTag>, Record<string, never>, Scalars['String'] | string>,
    description?: GraphCacheResolver<WithTypename<MediaTag>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<MediaTag>, Record<string, never>, Scalars['Int'] | string>,
    isAdult?: GraphCacheResolver<WithTypename<MediaTag>, Record<string, never>, Scalars['Boolean'] | string>,
    isGeneralSpoiler?: GraphCacheResolver<WithTypename<MediaTag>, Record<string, never>, Scalars['Boolean'] | string>,
    isMediaSpoiler?: GraphCacheResolver<WithTypename<MediaTag>, Record<string, never>, Scalars['Boolean'] | string>,
    name?: GraphCacheResolver<WithTypename<MediaTag>, Record<string, never>, Scalars['String'] | string>,
    rank?: GraphCacheResolver<WithTypename<MediaTag>, Record<string, never>, Scalars['Int'] | string>,
    userId?: GraphCacheResolver<WithTypename<MediaTag>, Record<string, never>, Scalars['Int'] | string>
  },
  MediaTitle?: {
    english?: GraphCacheResolver<WithTypename<MediaTitle>, MediaTitleEnglishArgs, Scalars['String'] | string>,
    native?: GraphCacheResolver<WithTypename<MediaTitle>, MediaTitleNativeArgs, Scalars['String'] | string>,
    romaji?: GraphCacheResolver<WithTypename<MediaTitle>, MediaTitleRomajiArgs, Scalars['String'] | string>,
    userPreferred?: GraphCacheResolver<WithTypename<MediaTitle>, Record<string, never>, Scalars['String'] | string>
  },
  MediaTrailer?: {
    id?: GraphCacheResolver<WithTypename<MediaTrailer>, Record<string, never>, Scalars['String'] | string>,
    site?: GraphCacheResolver<WithTypename<MediaTrailer>, Record<string, never>, Scalars['String'] | string>,
    thumbnail?: GraphCacheResolver<WithTypename<MediaTrailer>, Record<string, never>, Scalars['String'] | string>
  },
  MediaTrend?: {
    averageScore?: GraphCacheResolver<WithTypename<MediaTrend>, Record<string, never>, Scalars['Int'] | string>,
    date?: GraphCacheResolver<WithTypename<MediaTrend>, Record<string, never>, Scalars['Int'] | string>,
    episode?: GraphCacheResolver<WithTypename<MediaTrend>, Record<string, never>, Scalars['Int'] | string>,
    inProgress?: GraphCacheResolver<WithTypename<MediaTrend>, Record<string, never>, Scalars['Int'] | string>,
    media?: GraphCacheResolver<WithTypename<MediaTrend>, Record<string, never>, WithTypename<Media> | string>,
    mediaId?: GraphCacheResolver<WithTypename<MediaTrend>, Record<string, never>, Scalars['Int'] | string>,
    popularity?: GraphCacheResolver<WithTypename<MediaTrend>, Record<string, never>, Scalars['Int'] | string>,
    releasing?: GraphCacheResolver<WithTypename<MediaTrend>, Record<string, never>, Scalars['Boolean'] | string>,
    trending?: GraphCacheResolver<WithTypename<MediaTrend>, Record<string, never>, Scalars['Int'] | string>
  },
  MediaTrendConnection?: {
    edges?: GraphCacheResolver<WithTypename<MediaTrendConnection>, Record<string, never>, Array<WithTypename<MediaTrendEdge> | string>>,
    nodes?: GraphCacheResolver<WithTypename<MediaTrendConnection>, Record<string, never>, Array<WithTypename<MediaTrend> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<MediaTrendConnection>, Record<string, never>, WithTypename<PageInfo> | string>
  },
  MediaTrendEdge?: {
    node?: GraphCacheResolver<WithTypename<MediaTrendEdge>, Record<string, never>, WithTypename<MediaTrend> | string>
  },
  MessageActivity?: {
    createdAt?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Scalars['Int'] | string>,
    isLiked?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Scalars['Boolean'] | string>,
    isLocked?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Scalars['Boolean'] | string>,
    isPrivate?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Scalars['Boolean'] | string>,
    isSubscribed?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Scalars['Boolean'] | string>,
    likeCount?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Scalars['Int'] | string>,
    likes?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Array<WithTypename<User> | string>>,
    message?: GraphCacheResolver<WithTypename<MessageActivity>, MessageActivityMessageArgs, Scalars['String'] | string>,
    messenger?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, WithTypename<User> | string>,
    messengerId?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Scalars['Int'] | string>,
    recipient?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, WithTypename<User> | string>,
    recipientId?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Scalars['Int'] | string>,
    replies?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Array<WithTypename<ActivityReply> | string>>,
    replyCount?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Scalars['Int'] | string>,
    siteUrl?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, Scalars['String'] | string>,
    type?: GraphCacheResolver<WithTypename<MessageActivity>, Record<string, never>, ActivityType | string>
  },
  ModAction?: {
    createdAt?: GraphCacheResolver<WithTypename<ModAction>, Record<string, never>, Scalars['Int'] | string>,
    data?: GraphCacheResolver<WithTypename<ModAction>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<ModAction>, Record<string, never>, Scalars['Int'] | string>,
    mod?: GraphCacheResolver<WithTypename<ModAction>, Record<string, never>, WithTypename<User> | string>,
    objectId?: GraphCacheResolver<WithTypename<ModAction>, Record<string, never>, Scalars['Int'] | string>,
    objectType?: GraphCacheResolver<WithTypename<ModAction>, Record<string, never>, Scalars['String'] | string>,
    type?: GraphCacheResolver<WithTypename<ModAction>, Record<string, never>, ModActionType | string>,
    user?: GraphCacheResolver<WithTypename<ModAction>, Record<string, never>, WithTypename<User> | string>
  },
  NotificationOption?: {
    enabled?: GraphCacheResolver<WithTypename<NotificationOption>, Record<string, never>, Scalars['Boolean'] | string>,
    type?: GraphCacheResolver<WithTypename<NotificationOption>, Record<string, never>, NotificationType | string>
  },
  Page?: {
    activities?: GraphCacheResolver<WithTypename<Page>, PageActivitiesArgs, Array<WithTypename<ActivityUnion> | string>>,
    activityReplies?: GraphCacheResolver<WithTypename<Page>, PageActivityRepliesArgs, Array<WithTypename<ActivityReply> | string>>,
    airingSchedules?: GraphCacheResolver<WithTypename<Page>, PageAiringSchedulesArgs, Array<WithTypename<AiringSchedule> | string>>,
    characters?: GraphCacheResolver<WithTypename<Page>, PageCharactersArgs, Array<WithTypename<Character> | string>>,
    followers?: GraphCacheResolver<WithTypename<Page>, PageFollowersArgs, Array<WithTypename<User> | string>>,
    following?: GraphCacheResolver<WithTypename<Page>, PageFollowingArgs, Array<WithTypename<User> | string>>,
    likes?: GraphCacheResolver<WithTypename<Page>, PageLikesArgs, Array<WithTypename<User> | string>>,
    media?: GraphCacheResolver<WithTypename<Page>, PageMediaArgs, Array<WithTypename<Media> | string>>,
    mediaList?: GraphCacheResolver<WithTypename<Page>, PageMediaListArgs, Array<WithTypename<MediaList> | string>>,
    mediaTrends?: GraphCacheResolver<WithTypename<Page>, PageMediaTrendsArgs, Array<WithTypename<MediaTrend> | string>>,
    notifications?: GraphCacheResolver<WithTypename<Page>, PageNotificationsArgs, Array<WithTypename<NotificationUnion> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<Page>, Record<string, never>, WithTypename<PageInfo> | string>,
    recommendations?: GraphCacheResolver<WithTypename<Page>, PageRecommendationsArgs, Array<WithTypename<Recommendation> | string>>,
    reviews?: GraphCacheResolver<WithTypename<Page>, PageReviewsArgs, Array<WithTypename<Review> | string>>,
    staff?: GraphCacheResolver<WithTypename<Page>, PageStaffArgs, Array<WithTypename<Staff> | string>>,
    studios?: GraphCacheResolver<WithTypename<Page>, PageStudiosArgs, Array<WithTypename<Studio> | string>>,
    threadComments?: GraphCacheResolver<WithTypename<Page>, PageThreadCommentsArgs, Array<WithTypename<ThreadComment> | string>>,
    threads?: GraphCacheResolver<WithTypename<Page>, PageThreadsArgs, Array<WithTypename<Thread> | string>>,
    users?: GraphCacheResolver<WithTypename<Page>, PageUsersArgs, Array<WithTypename<User> | string>>
  },
  PageInfo?: {
    currentPage?: GraphCacheResolver<WithTypename<PageInfo>, Record<string, never>, Scalars['Int'] | string>,
    hasNextPage?: GraphCacheResolver<WithTypename<PageInfo>, Record<string, never>, Scalars['Boolean'] | string>,
    lastPage?: GraphCacheResolver<WithTypename<PageInfo>, Record<string, never>, Scalars['Int'] | string>,
    perPage?: GraphCacheResolver<WithTypename<PageInfo>, Record<string, never>, Scalars['Int'] | string>,
    total?: GraphCacheResolver<WithTypename<PageInfo>, Record<string, never>, Scalars['Int'] | string>
  },
  ParsedMarkdown?: {
    html?: GraphCacheResolver<WithTypename<ParsedMarkdown>, Record<string, never>, Scalars['String'] | string>
  },
  Recommendation?: {
    id?: GraphCacheResolver<WithTypename<Recommendation>, Record<string, never>, Scalars['Int'] | string>,
    media?: GraphCacheResolver<WithTypename<Recommendation>, Record<string, never>, WithTypename<Media> | string>,
    mediaRecommendation?: GraphCacheResolver<WithTypename<Recommendation>, Record<string, never>, WithTypename<Media> | string>,
    rating?: GraphCacheResolver<WithTypename<Recommendation>, Record<string, never>, Scalars['Int'] | string>,
    user?: GraphCacheResolver<WithTypename<Recommendation>, Record<string, never>, WithTypename<User> | string>,
    userRating?: GraphCacheResolver<WithTypename<Recommendation>, Record<string, never>, RecommendationRating | string>
  },
  RecommendationConnection?: {
    edges?: GraphCacheResolver<WithTypename<RecommendationConnection>, Record<string, never>, Array<WithTypename<RecommendationEdge> | string>>,
    nodes?: GraphCacheResolver<WithTypename<RecommendationConnection>, Record<string, never>, Array<WithTypename<Recommendation> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<RecommendationConnection>, Record<string, never>, WithTypename<PageInfo> | string>
  },
  RecommendationEdge?: {
    node?: GraphCacheResolver<WithTypename<RecommendationEdge>, Record<string, never>, WithTypename<Recommendation> | string>
  },
  RelatedMediaAdditionNotification?: {
    context?: GraphCacheResolver<WithTypename<RelatedMediaAdditionNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<RelatedMediaAdditionNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<RelatedMediaAdditionNotification>, Record<string, never>, Scalars['Int'] | string>,
    media?: GraphCacheResolver<WithTypename<RelatedMediaAdditionNotification>, Record<string, never>, WithTypename<Media> | string>,
    mediaId?: GraphCacheResolver<WithTypename<RelatedMediaAdditionNotification>, Record<string, never>, Scalars['Int'] | string>,
    type?: GraphCacheResolver<WithTypename<RelatedMediaAdditionNotification>, Record<string, never>, NotificationType | string>
  },
  Report?: {
    cleared?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, Scalars['Boolean'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, Scalars['Int'] | string>,
    reason?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, Scalars['String'] | string>,
    reported?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, WithTypename<User> | string>,
    reporter?: GraphCacheResolver<WithTypename<Report>, Record<string, never>, WithTypename<User> | string>
  },
  Review?: {
    body?: GraphCacheResolver<WithTypename<Review>, ReviewBodyArgs, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, Scalars['Int'] | string>,
    media?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, WithTypename<Media> | string>,
    mediaId?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, Scalars['Int'] | string>,
    mediaType?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, MediaType | string>,
    private?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, Scalars['Boolean'] | string>,
    rating?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, Scalars['Int'] | string>,
    ratingAmount?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, Scalars['Int'] | string>,
    score?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, Scalars['Int'] | string>,
    siteUrl?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, Scalars['String'] | string>,
    summary?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, Scalars['Int'] | string>,
    user?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, Scalars['Int'] | string>,
    userRating?: GraphCacheResolver<WithTypename<Review>, Record<string, never>, ReviewRating | string>
  },
  ReviewConnection?: {
    edges?: GraphCacheResolver<WithTypename<ReviewConnection>, Record<string, never>, Array<WithTypename<ReviewEdge> | string>>,
    nodes?: GraphCacheResolver<WithTypename<ReviewConnection>, Record<string, never>, Array<WithTypename<Review> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<ReviewConnection>, Record<string, never>, WithTypename<PageInfo> | string>
  },
  ReviewEdge?: {
    node?: GraphCacheResolver<WithTypename<ReviewEdge>, Record<string, never>, WithTypename<Review> | string>
  },
  RevisionHistory?: {
    action?: GraphCacheResolver<WithTypename<RevisionHistory>, Record<string, never>, RevisionHistoryAction | string>,
    changes?: GraphCacheResolver<WithTypename<RevisionHistory>, Record<string, never>, Scalars['Json'] | string>,
    character?: GraphCacheResolver<WithTypename<RevisionHistory>, Record<string, never>, WithTypename<Character> | string>,
    createdAt?: GraphCacheResolver<WithTypename<RevisionHistory>, Record<string, never>, Scalars['Int'] | string>,
    externalLink?: GraphCacheResolver<WithTypename<RevisionHistory>, Record<string, never>, WithTypename<MediaExternalLink> | string>,
    id?: GraphCacheResolver<WithTypename<RevisionHistory>, Record<string, never>, Scalars['Int'] | string>,
    media?: GraphCacheResolver<WithTypename<RevisionHistory>, Record<string, never>, WithTypename<Media> | string>,
    staff?: GraphCacheResolver<WithTypename<RevisionHistory>, Record<string, never>, WithTypename<Staff> | string>,
    studio?: GraphCacheResolver<WithTypename<RevisionHistory>, Record<string, never>, WithTypename<Studio> | string>,
    user?: GraphCacheResolver<WithTypename<RevisionHistory>, Record<string, never>, WithTypename<User> | string>
  },
  ScoreDistribution?: {
    amount?: GraphCacheResolver<WithTypename<ScoreDistribution>, Record<string, never>, Scalars['Int'] | string>,
    score?: GraphCacheResolver<WithTypename<ScoreDistribution>, Record<string, never>, Scalars['Int'] | string>
  },
  SiteStatistics?: {
    anime?: GraphCacheResolver<WithTypename<SiteStatistics>, SiteStatisticsAnimeArgs, WithTypename<SiteTrendConnection> | string>,
    characters?: GraphCacheResolver<WithTypename<SiteStatistics>, SiteStatisticsCharactersArgs, WithTypename<SiteTrendConnection> | string>,
    manga?: GraphCacheResolver<WithTypename<SiteStatistics>, SiteStatisticsMangaArgs, WithTypename<SiteTrendConnection> | string>,
    reviews?: GraphCacheResolver<WithTypename<SiteStatistics>, SiteStatisticsReviewsArgs, WithTypename<SiteTrendConnection> | string>,
    staff?: GraphCacheResolver<WithTypename<SiteStatistics>, SiteStatisticsStaffArgs, WithTypename<SiteTrendConnection> | string>,
    studios?: GraphCacheResolver<WithTypename<SiteStatistics>, SiteStatisticsStudiosArgs, WithTypename<SiteTrendConnection> | string>,
    users?: GraphCacheResolver<WithTypename<SiteStatistics>, SiteStatisticsUsersArgs, WithTypename<SiteTrendConnection> | string>
  },
  SiteTrend?: {
    change?: GraphCacheResolver<WithTypename<SiteTrend>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<SiteTrend>, Record<string, never>, Scalars['Int'] | string>,
    date?: GraphCacheResolver<WithTypename<SiteTrend>, Record<string, never>, Scalars['Int'] | string>
  },
  SiteTrendConnection?: {
    edges?: GraphCacheResolver<WithTypename<SiteTrendConnection>, Record<string, never>, Array<WithTypename<SiteTrendEdge> | string>>,
    nodes?: GraphCacheResolver<WithTypename<SiteTrendConnection>, Record<string, never>, Array<WithTypename<SiteTrend> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<SiteTrendConnection>, Record<string, never>, WithTypename<PageInfo> | string>
  },
  SiteTrendEdge?: {
    node?: GraphCacheResolver<WithTypename<SiteTrendEdge>, Record<string, never>, WithTypename<SiteTrend> | string>
  },
  Staff?: {
    age?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['Int'] | string>,
    bloodType?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['String'] | string>,
    characterMedia?: GraphCacheResolver<WithTypename<Staff>, StaffCharacterMediaArgs, WithTypename<MediaConnection> | string>,
    characters?: GraphCacheResolver<WithTypename<Staff>, StaffCharactersArgs, WithTypename<CharacterConnection> | string>,
    dateOfBirth?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, WithTypename<FuzzyDate> | string>,
    dateOfDeath?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, WithTypename<FuzzyDate> | string>,
    description?: GraphCacheResolver<WithTypename<Staff>, StaffDescriptionArgs, Scalars['String'] | string>,
    favourites?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['Int'] | string>,
    gender?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['String'] | string>,
    homeTown?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['Int'] | string>,
    image?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, WithTypename<StaffImage> | string>,
    isFavourite?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['Boolean'] | string>,
    isFavouriteBlocked?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['Boolean'] | string>,
    language?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, StaffLanguage | string>,
    languageV2?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['String'] | string>,
    modNotes?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, WithTypename<StaffName> | string>,
    primaryOccupations?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Array<Scalars['String'] | string>>,
    siteUrl?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['String'] | string>,
    staff?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, WithTypename<Staff> | string>,
    staffMedia?: GraphCacheResolver<WithTypename<Staff>, StaffStaffMediaArgs, WithTypename<MediaConnection> | string>,
    submissionNotes?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['String'] | string>,
    submissionStatus?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['Int'] | string>,
    submitter?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, WithTypename<User> | string>,
    updatedAt?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Scalars['Int'] | string>,
    yearsActive?: GraphCacheResolver<WithTypename<Staff>, Record<string, never>, Array<Scalars['Int'] | string>>
  },
  StaffConnection?: {
    edges?: GraphCacheResolver<WithTypename<StaffConnection>, Record<string, never>, Array<WithTypename<StaffEdge> | string>>,
    nodes?: GraphCacheResolver<WithTypename<StaffConnection>, Record<string, never>, Array<WithTypename<Staff> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<StaffConnection>, Record<string, never>, WithTypename<PageInfo> | string>
  },
  StaffEdge?: {
    favouriteOrder?: GraphCacheResolver<WithTypename<StaffEdge>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<StaffEdge>, Record<string, never>, Scalars['Int'] | string>,
    node?: GraphCacheResolver<WithTypename<StaffEdge>, Record<string, never>, WithTypename<Staff> | string>,
    role?: GraphCacheResolver<WithTypename<StaffEdge>, Record<string, never>, Scalars['String'] | string>
  },
  StaffImage?: {
    large?: GraphCacheResolver<WithTypename<StaffImage>, Record<string, never>, Scalars['String'] | string>,
    medium?: GraphCacheResolver<WithTypename<StaffImage>, Record<string, never>, Scalars['String'] | string>
  },
  StaffName?: {
    alternative?: GraphCacheResolver<WithTypename<StaffName>, Record<string, never>, Array<Scalars['String'] | string>>,
    first?: GraphCacheResolver<WithTypename<StaffName>, Record<string, never>, Scalars['String'] | string>,
    full?: GraphCacheResolver<WithTypename<StaffName>, Record<string, never>, Scalars['String'] | string>,
    last?: GraphCacheResolver<WithTypename<StaffName>, Record<string, never>, Scalars['String'] | string>,
    middle?: GraphCacheResolver<WithTypename<StaffName>, Record<string, never>, Scalars['String'] | string>,
    native?: GraphCacheResolver<WithTypename<StaffName>, Record<string, never>, Scalars['String'] | string>,
    userPreferred?: GraphCacheResolver<WithTypename<StaffName>, Record<string, never>, Scalars['String'] | string>
  },
  StaffRoleType?: {
    dubGroup?: GraphCacheResolver<WithTypename<StaffRoleType>, Record<string, never>, Scalars['String'] | string>,
    roleNotes?: GraphCacheResolver<WithTypename<StaffRoleType>, Record<string, never>, Scalars['String'] | string>,
    voiceActor?: GraphCacheResolver<WithTypename<StaffRoleType>, Record<string, never>, WithTypename<Staff> | string>
  },
  StaffStats?: {
    amount?: GraphCacheResolver<WithTypename<StaffStats>, Record<string, never>, Scalars['Int'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<StaffStats>, Record<string, never>, Scalars['Int'] | string>,
    staff?: GraphCacheResolver<WithTypename<StaffStats>, Record<string, never>, WithTypename<Staff> | string>,
    timeWatched?: GraphCacheResolver<WithTypename<StaffStats>, Record<string, never>, Scalars['Int'] | string>
  },
  StaffSubmission?: {
    assignee?: GraphCacheResolver<WithTypename<StaffSubmission>, Record<string, never>, WithTypename<User> | string>,
    createdAt?: GraphCacheResolver<WithTypename<StaffSubmission>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<StaffSubmission>, Record<string, never>, Scalars['Int'] | string>,
    locked?: GraphCacheResolver<WithTypename<StaffSubmission>, Record<string, never>, Scalars['Boolean'] | string>,
    notes?: GraphCacheResolver<WithTypename<StaffSubmission>, Record<string, never>, Scalars['String'] | string>,
    source?: GraphCacheResolver<WithTypename<StaffSubmission>, Record<string, never>, Scalars['String'] | string>,
    staff?: GraphCacheResolver<WithTypename<StaffSubmission>, Record<string, never>, WithTypename<Staff> | string>,
    status?: GraphCacheResolver<WithTypename<StaffSubmission>, Record<string, never>, SubmissionStatus | string>,
    submission?: GraphCacheResolver<WithTypename<StaffSubmission>, Record<string, never>, WithTypename<Staff> | string>,
    submitter?: GraphCacheResolver<WithTypename<StaffSubmission>, Record<string, never>, WithTypename<User> | string>
  },
  StatusDistribution?: {
    amount?: GraphCacheResolver<WithTypename<StatusDistribution>, Record<string, never>, Scalars['Int'] | string>,
    status?: GraphCacheResolver<WithTypename<StatusDistribution>, Record<string, never>, MediaListStatus | string>
  },
  Studio?: {
    favourites?: GraphCacheResolver<WithTypename<Studio>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<Studio>, Record<string, never>, Scalars['Int'] | string>,
    isAnimationStudio?: GraphCacheResolver<WithTypename<Studio>, Record<string, never>, Scalars['Boolean'] | string>,
    isFavourite?: GraphCacheResolver<WithTypename<Studio>, Record<string, never>, Scalars['Boolean'] | string>,
    media?: GraphCacheResolver<WithTypename<Studio>, StudioMediaArgs, WithTypename<MediaConnection> | string>,
    name?: GraphCacheResolver<WithTypename<Studio>, Record<string, never>, Scalars['String'] | string>,
    siteUrl?: GraphCacheResolver<WithTypename<Studio>, Record<string, never>, Scalars['String'] | string>
  },
  StudioConnection?: {
    edges?: GraphCacheResolver<WithTypename<StudioConnection>, Record<string, never>, Array<WithTypename<StudioEdge> | string>>,
    nodes?: GraphCacheResolver<WithTypename<StudioConnection>, Record<string, never>, Array<WithTypename<Studio> | string>>,
    pageInfo?: GraphCacheResolver<WithTypename<StudioConnection>, Record<string, never>, WithTypename<PageInfo> | string>
  },
  StudioEdge?: {
    favouriteOrder?: GraphCacheResolver<WithTypename<StudioEdge>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<StudioEdge>, Record<string, never>, Scalars['Int'] | string>,
    isMain?: GraphCacheResolver<WithTypename<StudioEdge>, Record<string, never>, Scalars['Boolean'] | string>,
    node?: GraphCacheResolver<WithTypename<StudioEdge>, Record<string, never>, WithTypename<Studio> | string>
  },
  StudioStats?: {
    amount?: GraphCacheResolver<WithTypename<StudioStats>, Record<string, never>, Scalars['Int'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<StudioStats>, Record<string, never>, Scalars['Int'] | string>,
    studio?: GraphCacheResolver<WithTypename<StudioStats>, Record<string, never>, WithTypename<Studio> | string>,
    timeWatched?: GraphCacheResolver<WithTypename<StudioStats>, Record<string, never>, Scalars['Int'] | string>
  },
  TagStats?: {
    amount?: GraphCacheResolver<WithTypename<TagStats>, Record<string, never>, Scalars['Int'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<TagStats>, Record<string, never>, Scalars['Int'] | string>,
    tag?: GraphCacheResolver<WithTypename<TagStats>, Record<string, never>, WithTypename<MediaTag> | string>,
    timeWatched?: GraphCacheResolver<WithTypename<TagStats>, Record<string, never>, Scalars['Int'] | string>
  },
  TextActivity?: {
    createdAt?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, Scalars['Int'] | string>,
    isLiked?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, Scalars['Boolean'] | string>,
    isLocked?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, Scalars['Boolean'] | string>,
    isPinned?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, Scalars['Boolean'] | string>,
    isSubscribed?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, Scalars['Boolean'] | string>,
    likeCount?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, Scalars['Int'] | string>,
    likes?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, Array<WithTypename<User> | string>>,
    replies?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, Array<WithTypename<ActivityReply> | string>>,
    replyCount?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, Scalars['Int'] | string>,
    siteUrl?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, Scalars['String'] | string>,
    text?: GraphCacheResolver<WithTypename<TextActivity>, TextActivityTextArgs, Scalars['String'] | string>,
    type?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, ActivityType | string>,
    user?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<TextActivity>, Record<string, never>, Scalars['Int'] | string>
  },
  Thread?: {
    body?: GraphCacheResolver<WithTypename<Thread>, ThreadBodyArgs, Scalars['String'] | string>,
    categories?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Array<WithTypename<ThreadCategory> | string>>,
    createdAt?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Int'] | string>,
    isLiked?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Boolean'] | string>,
    isLocked?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Boolean'] | string>,
    isSticky?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Boolean'] | string>,
    isSubscribed?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Boolean'] | string>,
    likeCount?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Int'] | string>,
    likes?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Array<WithTypename<User> | string>>,
    mediaCategories?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Array<WithTypename<Media> | string>>,
    repliedAt?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Int'] | string>,
    replyCommentId?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Int'] | string>,
    replyCount?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Int'] | string>,
    replyUser?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, WithTypename<User> | string>,
    replyUserId?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Int'] | string>,
    siteUrl?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['String'] | string>,
    title?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Int'] | string>,
    user?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Int'] | string>,
    viewCount?: GraphCacheResolver<WithTypename<Thread>, Record<string, never>, Scalars['Int'] | string>
  },
  ThreadCategory?: {
    id?: GraphCacheResolver<WithTypename<ThreadCategory>, Record<string, never>, Scalars['Int'] | string>,
    name?: GraphCacheResolver<WithTypename<ThreadCategory>, Record<string, never>, Scalars['String'] | string>
  },
  ThreadComment?: {
    childComments?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, Scalars['Json'] | string>,
    comment?: GraphCacheResolver<WithTypename<ThreadComment>, ThreadCommentCommentArgs, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, Scalars['Int'] | string>,
    isLiked?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, Scalars['Boolean'] | string>,
    isLocked?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, Scalars['Boolean'] | string>,
    likeCount?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, Scalars['Int'] | string>,
    likes?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, Array<WithTypename<User> | string>>,
    siteUrl?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, Scalars['String'] | string>,
    thread?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, WithTypename<Thread> | string>,
    threadId?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, Scalars['Int'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, Scalars['Int'] | string>,
    user?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ThreadComment>, Record<string, never>, Scalars['Int'] | string>
  },
  ThreadCommentLikeNotification?: {
    comment?: GraphCacheResolver<WithTypename<ThreadCommentLikeNotification>, Record<string, never>, WithTypename<ThreadComment> | string>,
    commentId?: GraphCacheResolver<WithTypename<ThreadCommentLikeNotification>, Record<string, never>, Scalars['Int'] | string>,
    context?: GraphCacheResolver<WithTypename<ThreadCommentLikeNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ThreadCommentLikeNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ThreadCommentLikeNotification>, Record<string, never>, Scalars['Int'] | string>,
    thread?: GraphCacheResolver<WithTypename<ThreadCommentLikeNotification>, Record<string, never>, WithTypename<Thread> | string>,
    type?: GraphCacheResolver<WithTypename<ThreadCommentLikeNotification>, Record<string, never>, NotificationType | string>,
    user?: GraphCacheResolver<WithTypename<ThreadCommentLikeNotification>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ThreadCommentLikeNotification>, Record<string, never>, Scalars['Int'] | string>
  },
  ThreadCommentMentionNotification?: {
    comment?: GraphCacheResolver<WithTypename<ThreadCommentMentionNotification>, Record<string, never>, WithTypename<ThreadComment> | string>,
    commentId?: GraphCacheResolver<WithTypename<ThreadCommentMentionNotification>, Record<string, never>, Scalars['Int'] | string>,
    context?: GraphCacheResolver<WithTypename<ThreadCommentMentionNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ThreadCommentMentionNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ThreadCommentMentionNotification>, Record<string, never>, Scalars['Int'] | string>,
    thread?: GraphCacheResolver<WithTypename<ThreadCommentMentionNotification>, Record<string, never>, WithTypename<Thread> | string>,
    type?: GraphCacheResolver<WithTypename<ThreadCommentMentionNotification>, Record<string, never>, NotificationType | string>,
    user?: GraphCacheResolver<WithTypename<ThreadCommentMentionNotification>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ThreadCommentMentionNotification>, Record<string, never>, Scalars['Int'] | string>
  },
  ThreadCommentReplyNotification?: {
    comment?: GraphCacheResolver<WithTypename<ThreadCommentReplyNotification>, Record<string, never>, WithTypename<ThreadComment> | string>,
    commentId?: GraphCacheResolver<WithTypename<ThreadCommentReplyNotification>, Record<string, never>, Scalars['Int'] | string>,
    context?: GraphCacheResolver<WithTypename<ThreadCommentReplyNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ThreadCommentReplyNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ThreadCommentReplyNotification>, Record<string, never>, Scalars['Int'] | string>,
    thread?: GraphCacheResolver<WithTypename<ThreadCommentReplyNotification>, Record<string, never>, WithTypename<Thread> | string>,
    type?: GraphCacheResolver<WithTypename<ThreadCommentReplyNotification>, Record<string, never>, NotificationType | string>,
    user?: GraphCacheResolver<WithTypename<ThreadCommentReplyNotification>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ThreadCommentReplyNotification>, Record<string, never>, Scalars['Int'] | string>
  },
  ThreadCommentSubscribedNotification?: {
    comment?: GraphCacheResolver<WithTypename<ThreadCommentSubscribedNotification>, Record<string, never>, WithTypename<ThreadComment> | string>,
    commentId?: GraphCacheResolver<WithTypename<ThreadCommentSubscribedNotification>, Record<string, never>, Scalars['Int'] | string>,
    context?: GraphCacheResolver<WithTypename<ThreadCommentSubscribedNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ThreadCommentSubscribedNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ThreadCommentSubscribedNotification>, Record<string, never>, Scalars['Int'] | string>,
    thread?: GraphCacheResolver<WithTypename<ThreadCommentSubscribedNotification>, Record<string, never>, WithTypename<Thread> | string>,
    type?: GraphCacheResolver<WithTypename<ThreadCommentSubscribedNotification>, Record<string, never>, NotificationType | string>,
    user?: GraphCacheResolver<WithTypename<ThreadCommentSubscribedNotification>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ThreadCommentSubscribedNotification>, Record<string, never>, Scalars['Int'] | string>
  },
  ThreadLikeNotification?: {
    comment?: GraphCacheResolver<WithTypename<ThreadLikeNotification>, Record<string, never>, WithTypename<ThreadComment> | string>,
    context?: GraphCacheResolver<WithTypename<ThreadLikeNotification>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<ThreadLikeNotification>, Record<string, never>, Scalars['Int'] | string>,
    id?: GraphCacheResolver<WithTypename<ThreadLikeNotification>, Record<string, never>, Scalars['Int'] | string>,
    thread?: GraphCacheResolver<WithTypename<ThreadLikeNotification>, Record<string, never>, WithTypename<Thread> | string>,
    threadId?: GraphCacheResolver<WithTypename<ThreadLikeNotification>, Record<string, never>, Scalars['Int'] | string>,
    type?: GraphCacheResolver<WithTypename<ThreadLikeNotification>, Record<string, never>, NotificationType | string>,
    user?: GraphCacheResolver<WithTypename<ThreadLikeNotification>, Record<string, never>, WithTypename<User> | string>,
    userId?: GraphCacheResolver<WithTypename<ThreadLikeNotification>, Record<string, never>, Scalars['Int'] | string>
  },
  User?: {
    about?: GraphCacheResolver<WithTypename<User>, UserAboutArgs, Scalars['String'] | string>,
    avatar?: GraphCacheResolver<WithTypename<User>, Record<string, never>, WithTypename<UserAvatar> | string>,
    bannerImage?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    bans?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Json'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Int'] | string>,
    donatorBadge?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    donatorTier?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Int'] | string>,
    favourites?: GraphCacheResolver<WithTypename<User>, UserFavouritesArgs, WithTypename<Favourites> | string>,
    id?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Int'] | string>,
    isBlocked?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Boolean'] | string>,
    isFollower?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Boolean'] | string>,
    isFollowing?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Boolean'] | string>,
    mediaListOptions?: GraphCacheResolver<WithTypename<User>, Record<string, never>, WithTypename<MediaListOptions> | string>,
    moderatorRoles?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Array<ModRole | string>>,
    moderatorStatus?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    name?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    options?: GraphCacheResolver<WithTypename<User>, Record<string, never>, WithTypename<UserOptions> | string>,
    previousNames?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Array<WithTypename<UserPreviousName> | string>>,
    siteUrl?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    statistics?: GraphCacheResolver<WithTypename<User>, Record<string, never>, WithTypename<UserStatisticTypes> | string>,
    stats?: GraphCacheResolver<WithTypename<User>, Record<string, never>, WithTypename<UserStats> | string>,
    unreadNotificationCount?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Int'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Int'] | string>
  },
  UserActivityHistory?: {
    amount?: GraphCacheResolver<WithTypename<UserActivityHistory>, Record<string, never>, Scalars['Int'] | string>,
    date?: GraphCacheResolver<WithTypename<UserActivityHistory>, Record<string, never>, Scalars['Int'] | string>,
    level?: GraphCacheResolver<WithTypename<UserActivityHistory>, Record<string, never>, Scalars['Int'] | string>
  },
  UserAvatar?: {
    large?: GraphCacheResolver<WithTypename<UserAvatar>, Record<string, never>, Scalars['String'] | string>,
    medium?: GraphCacheResolver<WithTypename<UserAvatar>, Record<string, never>, Scalars['String'] | string>
  },
  UserCountryStatistic?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserCountryStatistic>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<UserCountryStatistic>, Record<string, never>, Scalars['Int'] | string>,
    country?: GraphCacheResolver<WithTypename<UserCountryStatistic>, Record<string, never>, Scalars['CountryCode'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<UserCountryStatistic>, Record<string, never>, Scalars['Float'] | string>,
    mediaIds?: GraphCacheResolver<WithTypename<UserCountryStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserCountryStatistic>, Record<string, never>, Scalars['Int'] | string>
  },
  UserFormatStatistic?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserFormatStatistic>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<UserFormatStatistic>, Record<string, never>, Scalars['Int'] | string>,
    format?: GraphCacheResolver<WithTypename<UserFormatStatistic>, Record<string, never>, MediaFormat | string>,
    meanScore?: GraphCacheResolver<WithTypename<UserFormatStatistic>, Record<string, never>, Scalars['Float'] | string>,
    mediaIds?: GraphCacheResolver<WithTypename<UserFormatStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserFormatStatistic>, Record<string, never>, Scalars['Int'] | string>
  },
  UserGenreStatistic?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserGenreStatistic>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<UserGenreStatistic>, Record<string, never>, Scalars['Int'] | string>,
    genre?: GraphCacheResolver<WithTypename<UserGenreStatistic>, Record<string, never>, Scalars['String'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<UserGenreStatistic>, Record<string, never>, Scalars['Float'] | string>,
    mediaIds?: GraphCacheResolver<WithTypename<UserGenreStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserGenreStatistic>, Record<string, never>, Scalars['Int'] | string>
  },
  UserLengthStatistic?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserLengthStatistic>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<UserLengthStatistic>, Record<string, never>, Scalars['Int'] | string>,
    length?: GraphCacheResolver<WithTypename<UserLengthStatistic>, Record<string, never>, Scalars['String'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<UserLengthStatistic>, Record<string, never>, Scalars['Float'] | string>,
    mediaIds?: GraphCacheResolver<WithTypename<UserLengthStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserLengthStatistic>, Record<string, never>, Scalars['Int'] | string>
  },
  UserModData?: {
    alts?: GraphCacheResolver<WithTypename<UserModData>, Record<string, never>, Array<WithTypename<User> | string>>,
    bans?: GraphCacheResolver<WithTypename<UserModData>, Record<string, never>, Scalars['Json'] | string>,
    counts?: GraphCacheResolver<WithTypename<UserModData>, Record<string, never>, Scalars['Json'] | string>,
    email?: GraphCacheResolver<WithTypename<UserModData>, Record<string, never>, Scalars['String'] | string>,
    ip?: GraphCacheResolver<WithTypename<UserModData>, Record<string, never>, Scalars['Json'] | string>,
    privacy?: GraphCacheResolver<WithTypename<UserModData>, Record<string, never>, Scalars['Int'] | string>
  },
  UserOptions?: {
    activityMergeTime?: GraphCacheResolver<WithTypename<UserOptions>, Record<string, never>, Scalars['Int'] | string>,
    airingNotifications?: GraphCacheResolver<WithTypename<UserOptions>, Record<string, never>, Scalars['Boolean'] | string>,
    disabledListActivity?: GraphCacheResolver<WithTypename<UserOptions>, Record<string, never>, Array<WithTypename<ListActivityOption> | string>>,
    displayAdultContent?: GraphCacheResolver<WithTypename<UserOptions>, Record<string, never>, Scalars['Boolean'] | string>,
    notificationOptions?: GraphCacheResolver<WithTypename<UserOptions>, Record<string, never>, Array<WithTypename<NotificationOption> | string>>,
    profileColor?: GraphCacheResolver<WithTypename<UserOptions>, Record<string, never>, Scalars['String'] | string>,
    restrictMessagesToFollowing?: GraphCacheResolver<WithTypename<UserOptions>, Record<string, never>, Scalars['Boolean'] | string>,
    staffNameLanguage?: GraphCacheResolver<WithTypename<UserOptions>, Record<string, never>, UserStaffNameLanguage | string>,
    timezone?: GraphCacheResolver<WithTypename<UserOptions>, Record<string, never>, Scalars['String'] | string>,
    titleLanguage?: GraphCacheResolver<WithTypename<UserOptions>, Record<string, never>, UserTitleLanguage | string>
  },
  UserPreviousName?: {
    createdAt?: GraphCacheResolver<WithTypename<UserPreviousName>, Record<string, never>, Scalars['Int'] | string>,
    name?: GraphCacheResolver<WithTypename<UserPreviousName>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<UserPreviousName>, Record<string, never>, Scalars['Int'] | string>
  },
  UserReleaseYearStatistic?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserReleaseYearStatistic>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<UserReleaseYearStatistic>, Record<string, never>, Scalars['Int'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<UserReleaseYearStatistic>, Record<string, never>, Scalars['Float'] | string>,
    mediaIds?: GraphCacheResolver<WithTypename<UserReleaseYearStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserReleaseYearStatistic>, Record<string, never>, Scalars['Int'] | string>,
    releaseYear?: GraphCacheResolver<WithTypename<UserReleaseYearStatistic>, Record<string, never>, Scalars['Int'] | string>
  },
  UserScoreStatistic?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserScoreStatistic>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<UserScoreStatistic>, Record<string, never>, Scalars['Int'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<UserScoreStatistic>, Record<string, never>, Scalars['Float'] | string>,
    mediaIds?: GraphCacheResolver<WithTypename<UserScoreStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserScoreStatistic>, Record<string, never>, Scalars['Int'] | string>,
    score?: GraphCacheResolver<WithTypename<UserScoreStatistic>, Record<string, never>, Scalars['Int'] | string>
  },
  UserStaffStatistic?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserStaffStatistic>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<UserStaffStatistic>, Record<string, never>, Scalars['Int'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<UserStaffStatistic>, Record<string, never>, Scalars['Float'] | string>,
    mediaIds?: GraphCacheResolver<WithTypename<UserStaffStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserStaffStatistic>, Record<string, never>, Scalars['Int'] | string>,
    staff?: GraphCacheResolver<WithTypename<UserStaffStatistic>, Record<string, never>, WithTypename<Staff> | string>
  },
  UserStartYearStatistic?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserStartYearStatistic>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<UserStartYearStatistic>, Record<string, never>, Scalars['Int'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<UserStartYearStatistic>, Record<string, never>, Scalars['Float'] | string>,
    mediaIds?: GraphCacheResolver<WithTypename<UserStartYearStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserStartYearStatistic>, Record<string, never>, Scalars['Int'] | string>,
    startYear?: GraphCacheResolver<WithTypename<UserStartYearStatistic>, Record<string, never>, Scalars['Int'] | string>
  },
  UserStatisticTypes?: {
    anime?: GraphCacheResolver<WithTypename<UserStatisticTypes>, Record<string, never>, WithTypename<UserStatistics> | string>,
    manga?: GraphCacheResolver<WithTypename<UserStatisticTypes>, Record<string, never>, WithTypename<UserStatistics> | string>
  },
  UserStatistics?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserStatistics>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<UserStatistics>, Record<string, never>, Scalars['Int'] | string>,
    countries?: GraphCacheResolver<WithTypename<UserStatistics>, UserStatisticsCountriesArgs, Array<WithTypename<UserCountryStatistic> | string>>,
    episodesWatched?: GraphCacheResolver<WithTypename<UserStatistics>, Record<string, never>, Scalars['Int'] | string>,
    formats?: GraphCacheResolver<WithTypename<UserStatistics>, UserStatisticsFormatsArgs, Array<WithTypename<UserFormatStatistic> | string>>,
    genres?: GraphCacheResolver<WithTypename<UserStatistics>, UserStatisticsGenresArgs, Array<WithTypename<UserGenreStatistic> | string>>,
    lengths?: GraphCacheResolver<WithTypename<UserStatistics>, UserStatisticsLengthsArgs, Array<WithTypename<UserLengthStatistic> | string>>,
    meanScore?: GraphCacheResolver<WithTypename<UserStatistics>, Record<string, never>, Scalars['Float'] | string>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserStatistics>, Record<string, never>, Scalars['Int'] | string>,
    releaseYears?: GraphCacheResolver<WithTypename<UserStatistics>, UserStatisticsReleaseYearsArgs, Array<WithTypename<UserReleaseYearStatistic> | string>>,
    scores?: GraphCacheResolver<WithTypename<UserStatistics>, UserStatisticsScoresArgs, Array<WithTypename<UserScoreStatistic> | string>>,
    staff?: GraphCacheResolver<WithTypename<UserStatistics>, UserStatisticsStaffArgs, Array<WithTypename<UserStaffStatistic> | string>>,
    standardDeviation?: GraphCacheResolver<WithTypename<UserStatistics>, Record<string, never>, Scalars['Float'] | string>,
    startYears?: GraphCacheResolver<WithTypename<UserStatistics>, UserStatisticsStartYearsArgs, Array<WithTypename<UserStartYearStatistic> | string>>,
    statuses?: GraphCacheResolver<WithTypename<UserStatistics>, UserStatisticsStatusesArgs, Array<WithTypename<UserStatusStatistic> | string>>,
    studios?: GraphCacheResolver<WithTypename<UserStatistics>, UserStatisticsStudiosArgs, Array<WithTypename<UserStudioStatistic> | string>>,
    tags?: GraphCacheResolver<WithTypename<UserStatistics>, UserStatisticsTagsArgs, Array<WithTypename<UserTagStatistic> | string>>,
    voiceActors?: GraphCacheResolver<WithTypename<UserStatistics>, UserStatisticsVoiceActorsArgs, Array<WithTypename<UserVoiceActorStatistic> | string>>,
    volumesRead?: GraphCacheResolver<WithTypename<UserStatistics>, Record<string, never>, Scalars['Int'] | string>
  },
  UserStats?: {
    activityHistory?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<UserActivityHistory> | string>>,
    animeListScores?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, WithTypename<ListScoreStats> | string>,
    animeScoreDistribution?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<ScoreDistribution> | string>>,
    animeStatusDistribution?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<StatusDistribution> | string>>,
    chaptersRead?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Scalars['Int'] | string>,
    favouredActors?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<StaffStats> | string>>,
    favouredFormats?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<FormatStats> | string>>,
    favouredGenres?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<GenreStats> | string>>,
    favouredGenresOverview?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<GenreStats> | string>>,
    favouredStaff?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<StaffStats> | string>>,
    favouredStudios?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<StudioStats> | string>>,
    favouredTags?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<TagStats> | string>>,
    favouredYears?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<YearStats> | string>>,
    mangaListScores?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, WithTypename<ListScoreStats> | string>,
    mangaScoreDistribution?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<ScoreDistribution> | string>>,
    mangaStatusDistribution?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Array<WithTypename<StatusDistribution> | string>>,
    watchedTime?: GraphCacheResolver<WithTypename<UserStats>, Record<string, never>, Scalars['Int'] | string>
  },
  UserStatusStatistic?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserStatusStatistic>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<UserStatusStatistic>, Record<string, never>, Scalars['Int'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<UserStatusStatistic>, Record<string, never>, Scalars['Float'] | string>,
    mediaIds?: GraphCacheResolver<WithTypename<UserStatusStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserStatusStatistic>, Record<string, never>, Scalars['Int'] | string>,
    status?: GraphCacheResolver<WithTypename<UserStatusStatistic>, Record<string, never>, MediaListStatus | string>
  },
  UserStudioStatistic?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserStudioStatistic>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<UserStudioStatistic>, Record<string, never>, Scalars['Int'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<UserStudioStatistic>, Record<string, never>, Scalars['Float'] | string>,
    mediaIds?: GraphCacheResolver<WithTypename<UserStudioStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserStudioStatistic>, Record<string, never>, Scalars['Int'] | string>,
    studio?: GraphCacheResolver<WithTypename<UserStudioStatistic>, Record<string, never>, WithTypename<Studio> | string>
  },
  UserTagStatistic?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserTagStatistic>, Record<string, never>, Scalars['Int'] | string>,
    count?: GraphCacheResolver<WithTypename<UserTagStatistic>, Record<string, never>, Scalars['Int'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<UserTagStatistic>, Record<string, never>, Scalars['Float'] | string>,
    mediaIds?: GraphCacheResolver<WithTypename<UserTagStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserTagStatistic>, Record<string, never>, Scalars['Int'] | string>,
    tag?: GraphCacheResolver<WithTypename<UserTagStatistic>, Record<string, never>, WithTypename<MediaTag> | string>
  },
  UserVoiceActorStatistic?: {
    chaptersRead?: GraphCacheResolver<WithTypename<UserVoiceActorStatistic>, Record<string, never>, Scalars['Int'] | string>,
    characterIds?: GraphCacheResolver<WithTypename<UserVoiceActorStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    count?: GraphCacheResolver<WithTypename<UserVoiceActorStatistic>, Record<string, never>, Scalars['Int'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<UserVoiceActorStatistic>, Record<string, never>, Scalars['Float'] | string>,
    mediaIds?: GraphCacheResolver<WithTypename<UserVoiceActorStatistic>, Record<string, never>, Array<Scalars['Int'] | string>>,
    minutesWatched?: GraphCacheResolver<WithTypename<UserVoiceActorStatistic>, Record<string, never>, Scalars['Int'] | string>,
    voiceActor?: GraphCacheResolver<WithTypename<UserVoiceActorStatistic>, Record<string, never>, WithTypename<Staff> | string>
  },
  YearStats?: {
    amount?: GraphCacheResolver<WithTypename<YearStats>, Record<string, never>, Scalars['Int'] | string>,
    meanScore?: GraphCacheResolver<WithTypename<YearStats>, Record<string, never>, Scalars['Int'] | string>,
    year?: GraphCacheResolver<WithTypename<YearStats>, Record<string, never>, Scalars['Int'] | string>
  }
};

export type GraphCacheOptimisticUpdaters = {
  DeleteActivity?: GraphCacheOptimisticMutationResolver<MutationDeleteActivityArgs, Maybe<WithTypename<Deleted>>>,
  DeleteActivityReply?: GraphCacheOptimisticMutationResolver<MutationDeleteActivityReplyArgs, Maybe<WithTypename<Deleted>>>,
  DeleteCustomList?: GraphCacheOptimisticMutationResolver<MutationDeleteCustomListArgs, Maybe<WithTypename<Deleted>>>,
  DeleteMediaListEntry?: GraphCacheOptimisticMutationResolver<MutationDeleteMediaListEntryArgs, Maybe<WithTypename<Deleted>>>,
  DeleteReview?: GraphCacheOptimisticMutationResolver<MutationDeleteReviewArgs, Maybe<WithTypename<Deleted>>>,
  DeleteThread?: GraphCacheOptimisticMutationResolver<MutationDeleteThreadArgs, Maybe<WithTypename<Deleted>>>,
  DeleteThreadComment?: GraphCacheOptimisticMutationResolver<MutationDeleteThreadCommentArgs, Maybe<WithTypename<Deleted>>>,
  RateReview?: GraphCacheOptimisticMutationResolver<MutationRateReviewArgs, Maybe<WithTypename<Review>>>,
  SaveActivityReply?: GraphCacheOptimisticMutationResolver<MutationSaveActivityReplyArgs, Maybe<WithTypename<ActivityReply>>>,
  SaveListActivity?: GraphCacheOptimisticMutationResolver<MutationSaveListActivityArgs, Maybe<WithTypename<ListActivity>>>,
  SaveMediaListEntry?: GraphCacheOptimisticMutationResolver<MutationSaveMediaListEntryArgs, Maybe<WithTypename<MediaList>>>,
  SaveMessageActivity?: GraphCacheOptimisticMutationResolver<MutationSaveMessageActivityArgs, Maybe<WithTypename<MessageActivity>>>,
  SaveRecommendation?: GraphCacheOptimisticMutationResolver<MutationSaveRecommendationArgs, Maybe<WithTypename<Recommendation>>>,
  SaveReview?: GraphCacheOptimisticMutationResolver<MutationSaveReviewArgs, Maybe<WithTypename<Review>>>,
  SaveTextActivity?: GraphCacheOptimisticMutationResolver<MutationSaveTextActivityArgs, Maybe<WithTypename<TextActivity>>>,
  SaveThread?: GraphCacheOptimisticMutationResolver<MutationSaveThreadArgs, Maybe<WithTypename<Thread>>>,
  SaveThreadComment?: GraphCacheOptimisticMutationResolver<MutationSaveThreadCommentArgs, Maybe<WithTypename<ThreadComment>>>,
  ToggleActivityPin?: GraphCacheOptimisticMutationResolver<MutationToggleActivityPinArgs, Maybe<WithTypename<ActivityUnion>>>,
  ToggleActivitySubscription?: GraphCacheOptimisticMutationResolver<MutationToggleActivitySubscriptionArgs, Maybe<WithTypename<ActivityUnion>>>,
  ToggleFavourite?: GraphCacheOptimisticMutationResolver<MutationToggleFavouriteArgs, Maybe<WithTypename<Favourites>>>,
  ToggleFollow?: GraphCacheOptimisticMutationResolver<MutationToggleFollowArgs, Maybe<WithTypename<User>>>,
  ToggleLike?: GraphCacheOptimisticMutationResolver<MutationToggleLikeArgs, Maybe<Array<WithTypename<User>>>>,
  ToggleLikeV2?: GraphCacheOptimisticMutationResolver<MutationToggleLikeV2Args, Maybe<WithTypename<LikeableUnion>>>,
  ToggleThreadSubscription?: GraphCacheOptimisticMutationResolver<MutationToggleThreadSubscriptionArgs, Maybe<WithTypename<Thread>>>,
  UpdateAniChartHighlights?: GraphCacheOptimisticMutationResolver<MutationUpdateAniChartHighlightsArgs, Maybe<Scalars['Json']>>,
  UpdateAniChartSettings?: GraphCacheOptimisticMutationResolver<MutationUpdateAniChartSettingsArgs, Maybe<Scalars['Json']>>,
  UpdateFavouriteOrder?: GraphCacheOptimisticMutationResolver<MutationUpdateFavouriteOrderArgs, Maybe<WithTypename<Favourites>>>,
  UpdateMediaListEntries?: GraphCacheOptimisticMutationResolver<MutationUpdateMediaListEntriesArgs, Maybe<Array<WithTypename<MediaList>>>>,
  UpdateUser?: GraphCacheOptimisticMutationResolver<MutationUpdateUserArgs, Maybe<WithTypename<User>>>
};

export type GraphCacheUpdaters = {
  Mutation?: {
    DeleteActivity?: GraphCacheUpdateResolver<{ DeleteActivity: Maybe<WithTypename<Deleted>> }, MutationDeleteActivityArgs>,
    DeleteActivityReply?: GraphCacheUpdateResolver<{ DeleteActivityReply: Maybe<WithTypename<Deleted>> }, MutationDeleteActivityReplyArgs>,
    DeleteCustomList?: GraphCacheUpdateResolver<{ DeleteCustomList: Maybe<WithTypename<Deleted>> }, MutationDeleteCustomListArgs>,
    DeleteMediaListEntry?: GraphCacheUpdateResolver<{ DeleteMediaListEntry: Maybe<WithTypename<Deleted>> }, MutationDeleteMediaListEntryArgs>,
    DeleteReview?: GraphCacheUpdateResolver<{ DeleteReview: Maybe<WithTypename<Deleted>> }, MutationDeleteReviewArgs>,
    DeleteThread?: GraphCacheUpdateResolver<{ DeleteThread: Maybe<WithTypename<Deleted>> }, MutationDeleteThreadArgs>,
    DeleteThreadComment?: GraphCacheUpdateResolver<{ DeleteThreadComment: Maybe<WithTypename<Deleted>> }, MutationDeleteThreadCommentArgs>,
    RateReview?: GraphCacheUpdateResolver<{ RateReview: Maybe<WithTypename<Review>> }, MutationRateReviewArgs>,
    SaveActivityReply?: GraphCacheUpdateResolver<{ SaveActivityReply: Maybe<WithTypename<ActivityReply>> }, MutationSaveActivityReplyArgs>,
    SaveListActivity?: GraphCacheUpdateResolver<{ SaveListActivity: Maybe<WithTypename<ListActivity>> }, MutationSaveListActivityArgs>,
    SaveMediaListEntry?: GraphCacheUpdateResolver<{ SaveMediaListEntry: Maybe<WithTypename<MediaList>> }, MutationSaveMediaListEntryArgs>,
    SaveMessageActivity?: GraphCacheUpdateResolver<{ SaveMessageActivity: Maybe<WithTypename<MessageActivity>> }, MutationSaveMessageActivityArgs>,
    SaveRecommendation?: GraphCacheUpdateResolver<{ SaveRecommendation: Maybe<WithTypename<Recommendation>> }, MutationSaveRecommendationArgs>,
    SaveReview?: GraphCacheUpdateResolver<{ SaveReview: Maybe<WithTypename<Review>> }, MutationSaveReviewArgs>,
    SaveTextActivity?: GraphCacheUpdateResolver<{ SaveTextActivity: Maybe<WithTypename<TextActivity>> }, MutationSaveTextActivityArgs>,
    SaveThread?: GraphCacheUpdateResolver<{ SaveThread: Maybe<WithTypename<Thread>> }, MutationSaveThreadArgs>,
    SaveThreadComment?: GraphCacheUpdateResolver<{ SaveThreadComment: Maybe<WithTypename<ThreadComment>> }, MutationSaveThreadCommentArgs>,
    ToggleActivityPin?: GraphCacheUpdateResolver<{ ToggleActivityPin: Maybe<WithTypename<ActivityUnion>> }, MutationToggleActivityPinArgs>,
    ToggleActivitySubscription?: GraphCacheUpdateResolver<{ ToggleActivitySubscription: Maybe<WithTypename<ActivityUnion>> }, MutationToggleActivitySubscriptionArgs>,
    ToggleFavourite?: GraphCacheUpdateResolver<{ ToggleFavourite: Maybe<WithTypename<Favourites>> }, MutationToggleFavouriteArgs>,
    ToggleFollow?: GraphCacheUpdateResolver<{ ToggleFollow: Maybe<WithTypename<User>> }, MutationToggleFollowArgs>,
    ToggleLike?: GraphCacheUpdateResolver<{ ToggleLike: Maybe<Array<WithTypename<User>>> }, MutationToggleLikeArgs>,
    ToggleLikeV2?: GraphCacheUpdateResolver<{ ToggleLikeV2: Maybe<WithTypename<LikeableUnion>> }, MutationToggleLikeV2Args>,
    ToggleThreadSubscription?: GraphCacheUpdateResolver<{ ToggleThreadSubscription: Maybe<WithTypename<Thread>> }, MutationToggleThreadSubscriptionArgs>,
    UpdateAniChartHighlights?: GraphCacheUpdateResolver<{ UpdateAniChartHighlights: Maybe<Scalars['Json']> }, MutationUpdateAniChartHighlightsArgs>,
    UpdateAniChartSettings?: GraphCacheUpdateResolver<{ UpdateAniChartSettings: Maybe<Scalars['Json']> }, MutationUpdateAniChartSettingsArgs>,
    UpdateFavouriteOrder?: GraphCacheUpdateResolver<{ UpdateFavouriteOrder: Maybe<WithTypename<Favourites>> }, MutationUpdateFavouriteOrderArgs>,
    UpdateMediaListEntries?: GraphCacheUpdateResolver<{ UpdateMediaListEntries: Maybe<Array<WithTypename<MediaList>>> }, MutationUpdateMediaListEntriesArgs>,
    UpdateUser?: GraphCacheUpdateResolver<{ UpdateUser: Maybe<WithTypename<User>> }, MutationUpdateUserArgs>
  },
  Subscription?: {},
};

export type GraphCacheConfig = Parameters<typeof offlineExchange>[0] & {
  updates?: GraphCacheUpdaters,
  keys?: GraphCacheKeysConfig,
  optimistic?: GraphCacheOptimisticUpdaters,
  resolvers?: GraphCacheResolvers,
};